import { config } from "@/config";
import { AppError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { Redis } from "@upstash/redis";

export class RedisService {
  private redisClient: Redis | null = null;
  private isEnabled: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const { token, url } = config.redis;

    if (!token && !url) {
      this.isEnabled = false;
      logger.warn("Redis configuration is missing. Redis service is disabled.");
      throw new AppError("Redis configuration is missing", 500);
    }

    if (!this.redisClient) {
      this.redisClient = new Redis({
        url,
        token,
      });
      this.isEnabled = true;
    }
  }

  isConnected(): boolean {
    return this.isEnabled;
  }

  public getClient(): Redis {
    if (!this.isConnected()) {
      logger.error("Redis client is not connected");
      throw new AppError("Redis client is not connected", 500);
    }

    return this.redisClient!;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected()) {
      logger.error("Redis client is not connected");
      throw new AppError("Redis client is not connected", 500);
    }
    try {
      return await this.redisClient!.get(key);
    } catch (error) {
      logger.error("Redis GET error:", error);
      return null
    }
  }

  async set(
    key: string,
    value: string,
    expirationInSeconds?: number,
  ): Promise<void> {
    if (!this.isConnected()) {
      logger.error("Redis client is not connected");
      throw new AppError("Redis client is not connected", 500);
    }
    try {
      if (expirationInSeconds) {
        await this.redisClient!.setex(key, expirationInSeconds, value);
      } else {
        await this.redisClient!.set(key, value);
      }
    } catch (error) {
      logger.error("Redis SET error:", error);

    }
  }

  async delete(key: string): Promise<void> {
    if (!this.isConnected()) {
      logger.error("Redis client is not connected");
      throw new AppError("Redis client is not connected", 500);
    }
    try {
      await this.redisClient!.del(key);
    } catch (error) {
      logger.error("Redis DELETE error:", error);
    }
  }

  async increment(key: string): Promise<number | null> {
    if (!this.isConnected()) {
      logger.error("Redis client is not connected");
      throw new AppError("Redis client is not connected", 500);
    }
    try {
      return await this.redisClient!.incr(key);
    } catch (error) {
      logger.error("Redis INCREMENT error:", error);
      return null
    }
  }

  async expiration(key: string, expirationInSeconds: number): Promise<void> {
    if (!this.isConnected()) {
      logger.error("Redis client is not connected");
      throw new AppError("Redis client is not connected", 500);
    }
    try {
      await this.redisClient!.expire(key, expirationInSeconds);
    } catch (error) {
      logger.error("Redis EXPIRATION error:", error);
    }
  }

  async getTTL(key: string): Promise<number | null> {
    if (!this.isConnected()) {
      logger.error("Redis client is not connected");
      throw new AppError("Redis client is not connected", 500);
    }
    try {
      return await this.redisClient!.ttl(key);
    } catch (error) {
      logger.error("Redis GET TTL error:", error);
      return null
    }
  }
}


export const redisService = new RedisService();