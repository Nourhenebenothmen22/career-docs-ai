const BaseLetterService = require('./base.service');
const promptBuilder = require('../utils/promptBuilder');
const htmlTemplate = require('../utils/htmlTemplate');

module.exports = new BaseLetterService(
  'motivation',
  (data) => promptBuilder.buildMotivationPrompt(data),
  (data, text) => htmlTemplate.motivationLetter(data, text),
);
