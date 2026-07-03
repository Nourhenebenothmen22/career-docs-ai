const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const motivationRoutes = require('./routes/motivation.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const historyRoutes = require('./routes/history.routes');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use(rateLimiter());

app.get('/api/health', (_, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/api/motivation', motivationRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/history', historyRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (config.mongodbUri) {
  mongoose.connect(config.mongodbUri)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.warn('MongoDB not available — running without persistence', { message: err.message }));
} else {
  logger.warn('No MONGODB_URI configured — running without persistence');
}

const server = app.listen(config.port, () => {
  logger.info(`RISALATECH backend running on http://localhost:${config.port} [${config.nodeEnv}]`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise rejection', { reason: reason?.message || reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { message: err.message, stack: err.stack });
  process.exit(1);
});
