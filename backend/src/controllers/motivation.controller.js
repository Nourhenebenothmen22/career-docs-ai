const motivationService = require('../services/motivation.service');

exports.generate = async (req, res, next) => {
  try {
    const result = await motivationService.generate(req.body);
    res.json({ success: true, data: { id: result.id, letterText: result.letterText, htmlContent: result.htmlContent, createdAt: result.createdAt } });
  } catch (error) {
    next(error);
  }
};

exports.downloadPdf = async (req, res, next) => {
  try {
    const result = await motivationService.generateWithPdf(req.body);
    if (!result.pdfBuffer) {
      return res.status(400).json({ success: false, message: 'PDF generation requires Chromium. Run: npx puppeteer browsers install chrome' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="motivation-letter-${result.id || 'draft'}.pdf"`);
    res.send(result.pdfBuffer);
  } catch (error) {
    next(error);
  }
};
