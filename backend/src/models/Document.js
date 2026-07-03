const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['motivation', 'recommendation'],
    required: true,
  },
  inputData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  letterText: {
    type: String,
    required: true,
  },
  htmlContent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

documentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
