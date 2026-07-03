const axios = require('axios');
const config = require('../config');

class AiService {
  async generate(prompt) {
    const { apiKey, model } = config.huggingface;
    if (!apiKey || apiKey === 'hf_your_api_key_here') {
      return this.getFallbackResponse(prompt);
    }

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs: prompt, parameters: { max_new_tokens: 1024, temperature: 0.7, top_p: 0.9, do_sample: true, return_full_text: false } },
        { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 60000 }
      );
      return this.extractText(response.data);
    } catch (error) {
      if (error.response?.status === 503) {
        await new Promise(r => setTimeout(r, 5000));
        return this.generate(prompt);
      }
      console.error('AI API error:', error.message);
      return this.getFallbackResponse(prompt);
    }
  }

  extractText(data) {
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }
    if (typeof data === 'string') return data.trim();
    if (data?.generated_text) return data.generated_text.trim();
    return '';
  }

  getFallbackResponse(prompt) {
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
      return `To Whom It May Concern,\n\nI am writing to formally recommend ${candidate}, whom I have had the privilege of working with during their tenure at ${companyName}. As ${extract('Recommender Role') || 'a professional colleague'}, I have witnessed firsthand their exceptional capabilities and contributions.\n\n${candidate} demonstrated outstanding performance in their role as ${extract('Candidate Role') || jobTitle}, consistently delivering high-quality results and showing remarkable professionalism. Their work ethic, combined with their technical proficiency, made them a valuable asset to our team.\n\nI am confident that ${candidate} will bring the same level of dedication and excellence to any future role. I give my highest recommendation without reservation.\n\nPlease feel free to contact me should you require any additional information.\n\nSincerely,\n${recommender}`;
    }

    return `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background and qualifications, I am confident that I would be a valuable addition to your team.\n\nThroughout my career, I have developed expertise in areas directly relevant to this role. My experience has equipped me with the skills necessary to contribute effectively from day one and deliver meaningful results for ${companyName}.\n\nI am particularly drawn to ${companyName} because of its reputation for excellence and innovation. I am eager to bring my experience and enthusiasm to your organization and help drive continued success.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with the needs of your team.\n\nSincerely,\n${fullName}`;
  }
}

module.exports = new AiService();
