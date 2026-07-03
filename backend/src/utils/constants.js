module.exports = Object.freeze({
  API: {
    PREFIX: '/api',
    VERSION: 'v1',
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  AI: {
    MAX_TOKENS: 1024,
    TEMPERATURE: 0.7,
    TOP_P: 0.9,
    TIMEOUT_MS: 60000,
    MAX_RETRIES: 3,
    RETRY_BASE_DELAY_MS: 2000,
  },
  PDF: {
    MAX_CONCURRENT_PAGES: 5,
    BROWSER_IDLE_TIMEOUT_MS: 30000,
  },
  HTTP: {
    BODY_LIMIT: '1mb',
    RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
    RATE_LIMIT_MAX: 100,
  },
  LETTER_TYPES: {
    MOTIVATION: 'motivation',
    RECOMMENDATION: 'recommendation',
  },
  EXPERIENCE_LEVELS: ['junior', 'mid', 'senior'],
  PERFORMANCE_LEVELS: ['excellent', 'very good', 'good'],
  LANGUAGES: ['EN', 'FR'],
});
