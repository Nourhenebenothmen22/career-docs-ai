const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/career-docs-ai',
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
};
