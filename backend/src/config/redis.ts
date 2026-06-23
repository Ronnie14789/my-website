import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on('connect', () => logger.info('Redis connected'));
    redis.on('error', (err) => logger.error('Redis error:', err));
    redis.on('close', () => logger.warn('Redis connection closed'));
  }

  return redis;
};

const memoryCache = new Map<string, { value: string; expiry: number }>();

export const cacheGet = async (key: string): Promise<string | null> => {
  const client = getRedisClient();
  if (client) {
    try {
      return await client.get(key);
    } catch {
      // Fallback to memory
    }
  }
  const item = memoryCache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.value;
  }
  memoryCache.delete(key);
  return null;
};

export const cacheSet = async (key: string, value: string, ttlSeconds: number): Promise<void> => {
  const client = getRedisClient();
  if (client) {
    try {
      await client.setex(key, ttlSeconds, value);
      return;
    } catch {
      // Fallback to memory
    }
  }
  memoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
};

export const cacheDel = async (key: string): Promise<void> => {
  const client = getRedisClient();
  if (client) {
    try {
      await client.del(key);
    } catch {
      // ignore
    }
  }
  memoryCache.delete(key);
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  const client = getRedisClient();
  if (client) {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch {
      // ignore
    }
  }

  const regex = new RegExp(`^${pattern.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*')}$`);
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
};
