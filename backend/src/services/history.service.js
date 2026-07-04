const Document = require('../models/Document');

class HistoryService {
  async getAll(userId, page = 1, limit = 20) {
    const query = { userId };
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      Document.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Document.countDocuments(query),
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

  async getById(id, userId) {
    const doc = await Document.findOne({ _id: id, userId }).lean();
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

  async delete(id, userId) {
    const doc = await Document.findOneAndDelete({ _id: id, userId });
    return !!doc;
  }
}

module.exports = new HistoryService();
