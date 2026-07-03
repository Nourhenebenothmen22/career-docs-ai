const recommendationService = require('../services/recommendation.service');

exports.generate = async (req, res, next) => {
  try {
    const result = await recommendationService.generate(req.body);
    res.json({
      success: true,
      data: {
        id: result.id,
        letterText: result.letterText,
        htmlContent: result.htmlContent,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.downloadPdf = async (req, res, next) => {
  try {
    const result = await recommendationService.generateWithPdf(req.body);
    if (!result.pdfBuffer) {
      return res.status(500).json({ success: false, message: 'PDF generation unavailable — ensure Chromium is installed for Puppeteer' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="recommendation-letter-${result.id || 'draft'}.pdf"`);
    res.send(result.pdfBuffer);
  } catch (error) {
    next(error);
  }
};
