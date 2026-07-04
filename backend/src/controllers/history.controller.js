const historyService = require('../services/history.service');
const pdfGenerator = require('../utils/pdfGenerator');
const storageService = require('../services/storage.service');

exports.getAll = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const result = await historyService.getAll(req.user.id, page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const doc = await historyService.getById(req.params.id, req.user.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

exports.getPdf = async (req, res, next) => {
  try {
    const doc = await historyService.getById(req.params.id, req.user.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    const key = `documents/${doc.id}.pdf`;
    const s3Exists = await storageService.exists(key);
    
    let pdfBuffer;
    if (s3Exists) {
      pdfBuffer = await storageService.download(key);
    } else {
      pdfBuffer = await pdfGenerator.generate(doc.htmlContent);
      storageService.upload(key, pdfBuffer, 'application/pdf').catch(() => {});
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="letter-${req.params.id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await historyService.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};
