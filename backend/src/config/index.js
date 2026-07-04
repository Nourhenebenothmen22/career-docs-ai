const path = require('path');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment variables from local folder and root folder for flexibility
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const hasOpenRouter = !!process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here';
const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_API_KEY !== 'hf_your_api_key_here';
const missingAny = !hasOpenRouter && !hasHuggingFace;

if (missingAny) {
  logger.warn('Missing both OPENROUTER_API_KEY and HUGGINGFACE_API_KEY. Using local fallback response generator.');
}

const config = Object.freeze({
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    primaryModel: process.env.OPENROUTER_PRIMARY_MODEL || 'qwen/qwen-2.5-72b-instruct:free',
    fallbackModel: process.env.OPENROUTER_FALLBACK_MODEL || 'qwen/qwen-2.5-coder-32b-instruct:free',
    useFallback: !hasOpenRouter,
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
    model: process.env.HUGGINGFACE_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
    useFallback: !hasHuggingFace,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_change_me_in_prod',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret_change_me_in_prod',
  }
});

module.exports = config;
