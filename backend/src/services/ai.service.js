const axios = require('axios');
const crypto = require('crypto');
const config = require('../config');
const { AI } = require('../utils/constants');
const logger = require('../utils/logger');
const cacheService = require('./cache.service');

class AiService {
  constructor() {
    this.failureCount = 0;
    this.circuitOpen = false;
    this.circuitResetAt = 0;
    this.MAX_FAILURES = 5;
    this.CIRCUIT_RESET_MS = 60000;
  }

  async generate(prompt) {
    if (!prompt) return this.defaultMotivation();

    // Redis Caching
    const hash = crypto.createHash('sha256').update(prompt).digest('hex');
    const cacheKey = `ai:prompt:${hash}`;
    const cachedResponse = await cacheService.get(cacheKey);
    if (cachedResponse) {
      logger.info('Cache hit for AI prompt');
      return cachedResponse;
    }

    let resultText = '';

    if (this.circuitOpen) {
      if (Date.now() > this.circuitResetAt) {
        this.circuitOpen = false;
        this.failureCount = 0;
        logger.info('Circuit breaker reset — retrying primary AI API');
      } else {
        logger.warn('Circuit breaker open — falling back to secondary providers');
      }
    }

    // Try HuggingFace
    if (!this.circuitOpen && !config.huggingface.useFallback && config.huggingface.apiKey) {
      try {
        resultText = await this.attemptHuggingFace(prompt, 0);
      } catch (err) {
        logger.warn('Hugging Face failed, attempting Groq fallback', { message: err.message });
      }
    }

    // Try Groq fallback
    if (!resultText && process.env.GROQ_API_KEY) {
      try {
        resultText = await this.attemptGroq(prompt);
      } catch (err) {
        logger.warn('Groq fallback failed, attempting OpenAI fallback', { message: err.message });
      }
    }

    // Try OpenAI fallback
    if (!resultText && process.env.OPENAI_API_KEY) {
      try {
        resultText = await this.attemptOpenAI(prompt);
      } catch (err) {
        logger.warn('OpenAI fallback failed', { message: err.message });
      }
    }

    // Final Hardcoded fallback
    if (!resultText) {
      logger.warn('All AI API providers failed or are unconfigured — returning template fallback');
      resultText = this.getFallbackResponse(prompt);
    } else {
      // Cache response for 1 hour
      await cacheService.set(cacheKey, resultText, 3600);
    }

    return resultText;
  }

  async generateStream(prompt, onToken) {
    if (!prompt) {
      const fallback = this.defaultMotivation();
      for (const word of fallback.split(' ')) {
        onToken(word + ' ');
        await new Promise(r => setTimeout(r, 20));
      }
      return;
    }

    const hash = crypto.createHash('sha256').update(prompt).digest('hex');
    const cacheKey = `ai:prompt:${hash}`;
    const cachedResponse = await cacheService.get(cacheKey);
    if (cachedResponse) {
      logger.info('Cache hit for AI stream');
      const words = cachedResponse.split(' ');
      for (const word of words) {
        onToken(word + ' ');
        await new Promise(r => setTimeout(r, 15));
      }
      return;
    }

    let buffer = '';

    if (!config.huggingface.useFallback && config.huggingface.apiKey) {
      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${config.huggingface.model}`,
          {
            inputs: prompt,
            parameters: {
              max_new_tokens: AI.MAX_TOKENS,
              temperature: AI.TEMPERATURE,
              top_p: AI.TOP_P,
              do_sample: true,
              return_full_text: false,
            },
            stream: true,
          },
          {
            headers: {
              Authorization: `Bearer ${config.huggingface.apiKey}`,
              'Content-Type': 'application/json',
            },
            responseType: 'stream',
            timeout: AI.TIMEOUT_MS,
          }
        );

        for await (const chunk of response.data) {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (line.trim().startsWith('data:')) {
              try {
                const parsed = JSON.parse(line.trim().slice(5));
                const token = parsed.token?.text || '';
                onToken(token);
                buffer += token;
              } catch (e) {
                // Ignore chunk parsing errors
              }
            }
          }
        }
      } catch (err) {
        logger.warn('Hugging Face stream failed, falling back to simulated stream', { message: err.message });
      }
    }

    if (!buffer.trim()) {
      const fallbackText = this.getFallbackResponse(prompt);
      const words = fallbackText.split(' ');
      for (const word of words) {
        onToken(word + ' ');
        await new Promise(r => setTimeout(r, 25));
      }
    } else {
      await cacheService.set(cacheKey, buffer.trim(), 3600);
    }
  }

  async attemptHuggingFace(prompt, attempt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI.TIMEOUT_MS);

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${config.huggingface.model}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: AI.MAX_TOKENS,
            temperature: AI.TEMPERATURE,
            top_p: AI.TOP_P,
            do_sample: true,
            return_full_text: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${config.huggingface.apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          timeout: AI.TIMEOUT_MS,
        }
      );

      clearTimeout(timeoutId);
      this.failureCount = 0;
      return this.extractText(response.data);
    } catch (error) {
      clearTimeout(timeoutId);
      this.failureCount += 1;

      const isRateLimited = error.response?.status === 503 || error.response?.status === 429;
      const isTimeout = error.code === 'ECONNABORTED' || error.name === 'AbortError';

      if ((isRateLimited || isTimeout) && attempt < AI.MAX_RETRIES) {
        const delay = AI.RETRY_BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 1000;
        logger.warn(`AI Hugging Face failure (attempt ${attempt + 1}/${AI.MAX_RETRIES}), retrying in ${Math.round(delay)}ms`);
        await new Promise(r => setTimeout(r, delay));
        return this.attemptHuggingFace(prompt, attempt + 1);
      }

      if (this.failureCount >= this.MAX_FAILURES) {
        this.circuitOpen = true;
        this.circuitResetAt = Date.now() + this.CIRCUIT_RESET_MS;
        logger.error('Hugging Face circuit breaker opened due to successive failures');
      }

      throw error;
    }
  }

  async attemptGroq(prompt) {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: AI.MAX_TOKENS,
        temperature: AI.TEMPERATURE,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );
    return response.data?.choices?.[0]?.message?.content?.trim() || '';
  }

  async attemptOpenAI(prompt) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: AI.MAX_TOKENS,
        temperature: AI.TEMPERATURE,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );
    return response.data?.choices?.[0]?.message?.content?.trim() || '';
  }

  extractText(data) {
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    if (typeof data === 'string') return data.trim();
    if (data?.generated_text) return data.generated_text.trim();
    logger.warn('Unexpected AI response format', { type: typeof data });
    return '';
  }

  getFallbackResponse(prompt) {
    if (!prompt) return this.defaultMotivation();

    const lines = prompt.split('\n').filter(l => l.includes(':'));
    const extract = (key) => {
      const line = lines.find(l => l.trim().startsWith(key));
      return line ? line.split(':').slice(1).join(':').trim() : '';
    };

    const fullName = extract('Full Name') || extract('Candidate Name') || 'the Candidate';
    const jobTitle = extract('Applying for') || extract('Candidate Role') || 'the Position';
    const companyName = extract('Company') || 'Your Company';
    const isRecommendation = prompt.includes('recommendation letter') || prompt.includes('Recommender Name');

    if (isRecommendation) {
      const recommender = extract('Recommender Name') || 'The Recommender';
      const candidate = extract('Candidate Name') || fullName;
      return [
        `To Whom It May Concern,`,
        ``,
        `I am writing to formally recommend ${candidate}, whom I have had the privilege of working with during their tenure at ${companyName}. As ${extract('Recommender Role') || 'a professional colleague'}, I have witnessed firsthand their exceptional capabilities and contributions to our organization.`,
        ``,
        `${candidate} demonstrated outstanding performance in their role as ${extract('Candidate Role') || jobTitle}, consistently delivering high-quality results and showing remarkable professionalism. Their work ethic, combined with their technical proficiency, made them a valuable asset to our team.`,
        ``,
        `I am confident that ${candidate} will bring the same level of dedication and excellence to any future role. I give my highest recommendation without reservation.`,
        ``,
        `Please feel free to contact me should you require any additional information.`,
        ``,
        `Sincerely,`,
        `${recommender}`,
      ].join('\n');
    }

    return [
      `Dear Hiring Manager,`,
      ``,
      `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background and qualifications, I am confident that I would be a valuable addition to your team.`,
      ``,
      `Throughout my career, I have developed expertise in areas directly relevant to this role. My experience has equipped me with the skills necessary to contribute effectively from day one and deliver meaningful results for ${companyName}.`,
      ``,
      `I am particularly drawn to ${companyName} because of its reputation for excellence and innovation. I am eager to bring my experience and enthusiasm to your organization and help drive continued success.`,
      ``,
      `Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with the needs of your team.`,
      ``,
      `Sincerely,`,
      `${fullName}`,
    ].join('\n');
  }

  defaultMotivation() {
    return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the position at your company. With my background and qualifications, I am confident that I would be a valuable addition to your team.\n\nI have developed expertise in areas directly relevant to this role and am eager to bring my experience and enthusiasm to your organization.\n\nThank you for considering my application.\n\nSincerely,\nCandidate`;
  }
}

module.exports = new AiService();
