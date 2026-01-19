import { logger } from "@/utils/logger";
import { redisService } from "./redis.service";


export interface RateLimitResult{
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}


export class RateLimitService {

    async checkRateLimit(key: string, limit: number, windowInSeconds: number): Promise<RateLimitResult> {
        
        if(!redisService.isConnected()){
            return {
                allowed: true,
                remaining: limit,
                resetAt: new Date(Date.now() + windowInSeconds * 1000),
            };
        }


        try {

            const count = await redisService.increment(key);
            if(count == 1){
                await redisService.expiration(key, windowInSeconds);
            }

            const allowed = count <= limit;

            const remain = Math.max(0, limit - count);

            const ttl = await redisService.getTTL(key);
            const resetAt = new Date(Date.now() + ttl * 1000);

            if(!allowed){
                logger.warn(`Rate limit exceeded for key: ${key}`);
            }

            return {
                allowed,
                remaining: remain,
                resetAt,
            
            }

            
        } catch (error) {
            logger.error("Rate limit check error:", error);
            return {
                allowed: true,
                remaining: limit,
                resetAt: new Date(Date.now() + windowInSeconds * 1000),
            };
            
        }
    }

    async resetRateLimit(key: string): Promise<void> {
        if(!redisService.isConnected()){
            return;
        }
        try {
            await redisService.delete(key);
            logger.info(`Rate limit reset for key: ${key}`);
        } catch (error) {
            logger.error("Rate limit reset error:", error);
        }
        
    }

    async getRateLimit (key:string, limit:number, windowInSeconds:number):Promise<RateLimitResult>{
        if(!redisService.isConnected()){
            return {
                allowed: true,
                remaining: limit,
                resetAt: new Date(Date.now() + windowInSeconds * 1000),
            };
        }

        try {
            const count = await redisService.get(key);
            const currentCount = count ? parseInt(count) : 0;
            const ttl = await redisService.getTTL(key);

            return {
                allowed: currentCount < limit,
                remaining: Math.max(0, limit - currentCount),
                resetAt: new Date(Date.now() + ttl * 1000),
            }
            
        } catch (error) {
            return{
                allowed: true,
                remaining: limit,
                resetAt: new Date(Date.now() + windowInSeconds * 1000)
            }
        }
    }
}

export const rateLimitService = new RateLimitService();