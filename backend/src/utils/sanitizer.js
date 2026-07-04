const { AppError } = require('./AppError');

const PROHIBITED_PATTERNS = [
  /ignore\s+(all\s+)?previous/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\/?s>/i,
  /system\s*:/i,
  /you\s+are\s+now/i,
  /forget\s+(everything|all)/i,
  /new\s+instructions/i
];

function sanitizeString(val) {
  if (typeof val !== 'string') return val;
  const cleaned = val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(cleaned)) {
      throw new AppError('Input contains prohibited prompt injection patterns', 400, 'PROHIBITED_INPUT');
    }
  }
  return cleaned;
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeString(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(item => {
        if (typeof item === 'object') return sanitizeObject(item);
        return sanitizeString(item);
      });
    } else if (typeof obj[key] === 'object') {
      obj[key] = sanitizeObject(obj[key]);
    }
  }
  return obj;
}

module.exports = {
  sanitizeString,
  sanitizeObject,
};
