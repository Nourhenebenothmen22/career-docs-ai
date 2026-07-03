const BaseLetterService = require('./base.service');
const promptBuilder = require('../utils/promptBuilder');
const htmlTemplate = require('../utils/htmlTemplate');

module.exports = new BaseLetterService(
  'recommendation',
  (data) => promptBuilder.buildRecommendationPrompt(data),
  (data, text) => htmlTemplate.recommendationLetter(data, text),
);
