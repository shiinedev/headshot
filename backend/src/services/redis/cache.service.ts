import { logger } from "@/utils/logger";
import { redisService } from "./redis.service";
import { all } from "better-all";


export class CacheService {
  private client = redisService.getClient();

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!redisService.isConnected()) return;

    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setex(key, ttl, serializedValue);
    } catch (error) {
      logger.error(`CacheService set error: ${error}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!redisService.isConnected()) return null;

    try {
      const data = await redisService.get(key);

      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      logger.error(`CacheService get error: ${error}`);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    if (!redisService.isConnected()) return;

    try {
      await redisService.delete(key);
    } catch (error) {
      logger.error(`CacheService delete error: ${error}`);
    }
  }

  // delete all keys matching a pattern
  async deleteByPattern(pattern: string): Promise<void> {
    const self = this;

    if (!redisService.isConnected()) return;
    try {
      const keys: string[] = [];
      let cursor = 0;
      do {
        const result: any = await this.client.scan(cursor, {
          match: pattern,
          count: 100,
        });

        if (Array.isArray(result) && result.length === 2) {
          const cursorValues = result[0];
          const foundKeys = result[1];

          cursor =
            cursorValues === "number"
              ? cursorValues
              : parseInt(String(cursorValues), 10);

          if (Array.isArray(foundKeys)) {
            keys.push(...foundKeys);
          }
        }
      } while (cursor !== 0);

      if (keys.length > 0) {
        await all({
          async deleteKeys() {
            keys.map(async (key) => await self.delete(key));
          },
        });
      }
    } catch (error) {
      logger.error(`CacheService deleteByPattern error: ${error}`);
    }
  }
}

export const cacheService = new CacheService();

