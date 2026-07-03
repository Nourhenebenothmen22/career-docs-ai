const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const motivationRoutes = require('./routes/motivation.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const historyRoutes = require('./routes/history.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/motivation', motivationRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/history', historyRoutes);

app.use(errorHandler);

mongoose.connect(config.mongodbUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.warn('MongoDB not available — running without persistence:', err.message));

app.listen(config.port, () => {
  console.log(`Career Docs AI backend running on http://localhost:${config.port}`);
});
