const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const config = require('./config');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const authRoutes = require('./routes/auth.routes');
const motivationRoutes = require('./routes/motivation.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const historyRoutes = require('./routes/history.routes');
const gdprRoutes = require('./routes/gdpr.routes');
const logger = require('./utils/logger');
const { isRedisEnabled } = require('./config/redis');
const { isStorageEnabled } = require('./config/storage');
const { startWorker } = require('./workers/pdf.worker');

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.cors.origin }));
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use(rateLimiter());

app.get('/api/health', (_, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const redisConnected = isRedisEnabled();
  const storageConnected = isStorageEnabled();

  const isHealthy = dbConnected;

  res.status(isHealthy ? 200 : 500).json({
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'unhealthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      redis: redisConnected ? 'connected' : 'disconnected',
      storage: storageConnected ? 'configured' : 'disabled',
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/motivation', motivationRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/gdpr', gdprRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (config.mongodbUri) {
  mongoose.connect(config.mongodbUri)
    .then(() => {
      logger.info('MongoDB connected');
      startWorker();
    })
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
  console.error('Uncaught exception occurred:', err);
  process.exit(1);
});
