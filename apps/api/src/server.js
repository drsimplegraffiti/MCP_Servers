import mongoose from 'mongoose';
import config from './config/index.js';
import { createApp } from './app.js';

async function start() {
  try {
    if (!config.mongoUri) throw new Error('MONGO_URI environment variable is required');
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    const app = createApp();
    app.listen(config.port, () => console.log(`API server running on port ${config.port}`));
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
}

start();
