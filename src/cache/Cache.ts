import NodeCache from 'node-cache';
import ApiConfig from '../config/api.config';

class Cache {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2 });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }
}

export const cache = new Cache(ApiConfig.CACHE_TTL);