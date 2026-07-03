const isProduction = process.env.NODE_ENV === 'production';
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[isProduction ? 'info' : 'debug'];

function formatMessage(level, msg, meta) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: msg,
    ...(meta && { meta }),
  };
  return isProduction
    ? JSON.stringify(entry)
    : `[${entry.timestamp}] ${level.toUpperCase()}: ${msg}${meta ? ' ' + JSON.stringify(meta) : ''}`;
}

const logger = {
  error: (msg, meta) => currentLevel >= LEVELS.error && console.error(formatMessage('error', msg, meta)),
  warn: (msg, meta) => currentLevel >= LEVELS.warn && console.warn(formatMessage('warn', msg, meta)),
  info: (msg, meta) => currentLevel >= LEVELS.info && console.info(formatMessage('info', msg, meta)),
  debug: (msg, meta) => currentLevel >= LEVELS.debug && console.debug(formatMessage('debug', msg, meta)),
};

module.exports = logger;
