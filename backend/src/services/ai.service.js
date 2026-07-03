const axios = require('axios');
const config = require('../config');
const { AI } = require('../utils/constants');
const logger = require('../utils/logger');

class AiService {
  constructor() {
    this.failureCount = 0;
    this.circuitOpen = false;
    this.circuitResetAt = 0;
    this.MAX_FAILURES = 5;
    this.CIRCUIT_RESET_MS = 60000;
  }

  async generate(prompt) {
    if (config.huggingface.useFallback) {
      return this.getFallbackResponse(prompt);
    }

    if (this.circuitOpen) {
      if (Date.now() > this.circuitResetAt) {
        this.circuitOpen = false;
        this.failureCount = 0;
        logger.info('Circuit breaker reset — retrying AI API');
      } else {
        logger.warn('Circuit breaker open — using fallback');
        return this.getFallbackResponse(prompt);
      }
    }

    return this.attemptRequest(prompt, 0);
  }

  async attemptRequest(prompt, attempt) {
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
        logger.warn(`AI ${isTimeout ? 'timeout' : 'rate limited'} (attempt ${attempt + 1}/${AI.MAX_RETRIES}), retrying in ${Math.round(delay)}ms`);
        await new Promise(r => setTimeout(r, delay));
        return this.attemptRequest(prompt, attempt + 1);
      }

      if (this.failureCount >= this.MAX_FAILURES) {
        this.circuitOpen = true;
        this.circuitResetAt = Date.now() + this.CIRCUIT_RESET_MS;
        logger.error('Circuit breaker opened — too many AI API failures');
      }

      logger.error('AI API request failed', {
        status: error.response?.status,
        message: error.message,
        attempts: attempt + 1,
      });

      return this.getFallbackResponse(prompt);
    }
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
