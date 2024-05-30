import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisCache } from 'cache-manager-redis-yet';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private redisClient: RedisClientType;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {
    this.redisClient = this.cacheManager.store.client;
  }

  async incr(key: string) {
    return await this.redisClient.incr(key);
  }

  async incrBy(key: string, value: number) {
    return await this.redisClient.incrBy(key, value);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async keys(key: string) {
    return await this.redisClient.keys(key);
  }

  async getMultipleKeydata(key: string): Promise<any> {
    const redisKeys = await this.keys(key);
    const data: { [key: string]: any } = {};
    for (const key of redisKeys) {
      data[key] = await this.keys(key);
    }
    return data;
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }
}
