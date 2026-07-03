const Document = require('../models/Document');

class HistoryService {
  async getAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      Document.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Document.countDocuments(),
    ]);
    return {
      documents: docs.map(d => ({
        id: d._id,
        type: d.type,
        createdAt: d.createdAt,
        summary: d.type === 'motivation'
          ? `${d.inputData.fullName} — ${d.inputData.jobTitle}`
          : `${d.inputData.candidateName} — ${d.inputData.candidateRole}`,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id) {
    const doc = await Document.findById(id).lean();
    if (!doc) return null;
    return {
      id: doc._id,
      type: doc.type,
      inputData: doc.inputData,
      letterText: doc.letterText,
      htmlContent: doc.htmlContent,
      createdAt: doc.createdAt,
    };
  }

  async delete(id) {
    const doc = await Document.findByIdAndDelete(id);
    return !!doc;
  }
}

module.exports = new HistoryService();
