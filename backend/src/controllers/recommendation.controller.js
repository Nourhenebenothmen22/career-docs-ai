const recommendationService = require('../services/recommendation.service');
const promptBuilder = require('../utils/promptBuilder');
const aiService = require('../services/ai.service');
const htmlTemplate = require('../utils/htmlTemplate');
const Document = require('../models/Document');
const logger = require('../utils/logger');

exports.generate = async (req, res, next) => {
  try {
    const result = await recommendationService.generate(req.body, req.user?.id);
    res.json({ success: true, data: { id: result.id, letterText: result.letterText, htmlContent: result.htmlContent, createdAt: result.createdAt } });
  } catch (error) {
    next(error);
  }
};

exports.downloadPdf = async (req, res, next) => {
  try {
    const result = await recommendationService.generateWithPdf(req.body, req.user?.id);
    if (!result.pdfBuffer) {
      return res.status(400).json({ success: false, message: 'PDF generation requires Chromium. Run: npx puppeteer browsers install chrome' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="recommendation-letter-${result.id || 'draft'}.pdf"`);
    res.send(result.pdfBuffer);
  } catch (error) {
    next(error);
  }
};

exports.generateStream = async (req, res, next) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const enrichedData = { ...req.body, language: req.body.language || 'EN' };
    const prompt = promptBuilder.buildRecommendationPrompt(enrichedData);

    let fullText = '';
    await aiService.generateStream(prompt, (token) => {
      fullText += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    });

    const htmlContent = htmlTemplate.recommendationLetter(enrichedData, fullText);
    
    let doc;
    try {
      doc = await Document.create({
        type: 'recommendation',
        userId: req.user?.id || null,
        inputData: enrichedData,
        letterText: fullText,
        htmlContent,
      });
    } catch (err) {
      logger.warn('Failed to save streamed recommendation document to DB', { message: err.message });
    }

    res.write(`data: ${JSON.stringify({ done: true, documentId: doc?._id || null, htmlContent })}\n\n`);
    res.end();
  } catch (error) {
    logger.error('Streaming generation failed', { error: error.message });
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};
