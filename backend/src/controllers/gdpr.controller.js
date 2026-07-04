const User = require('../models/User');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const storageService = require('../services/storage.service');
const { AppError } = require('../utils/AppError');

exports.exportData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return next(new AppError('User not found', 404, 'NOT_FOUND'));

    const documents = await Document.find({ userId });
    const logs = await AuditLog.find({ userId });

    res.json({
      success: true,
      data: {
        user,
        documents,
        logs,
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Delete S3 caches
    const docs = await Document.find({ userId });
    for (const doc of docs) {
      const key = `documents/${doc._id}.pdf`;
      await storageService.delete(key).catch(() => {});
    }

    // Delete DB records
    await Document.deleteMany({ userId });
    await AuditLog.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    // Clear session cookies
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Account and associated data deleted successfully in compliance with GDPR.',
    });
  } catch (error) {
    next(error);
  }
};
