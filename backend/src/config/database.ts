import mongoose from 'mongoose';
import logger from '../utils/logger';

const MONGO_URI =
  process.env.MONGODB_URI ?? process.env.MONGO_URI ?? 'mongodb://localhost:27017/mywebsite';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

const connectDB = connectDatabase;
export default connectDB;

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});
