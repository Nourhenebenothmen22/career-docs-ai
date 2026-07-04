const path = require('path');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment variables from local folder and root folder for flexibility
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const requiredVars = ['HUGGINGFACE_API_KEY'];
const missing = requiredVars.filter(v => !process.env[v] || process.env[v] === 'hf_your_api_key_here');
if (missing.length > 0) {
  logger.warn(`Missing required env vars: ${missing.join(', ')} — using fallback responses`);
}

const config = Object.freeze({
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
    model: process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
    useFallback: missing.length > 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_change_me_in_prod',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret_change_me_in_prod',
  }
});

module.exports = config;
