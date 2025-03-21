import ApiService from "./ApiService";
import { Mt4Client, Mt4Licence, Mt4Product } from "@/entities/entities/client.entity";
import Cache from "./Cache";

class CacheDecorator {
  private apiService: typeof ApiService;
  private cache: Cache<any>;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor(apiService: typeof ApiService, ttl: number) {
    this.apiService = apiService;
    this.cache = new Cache(ttl);
  }

  // Helper to deduplicate in-flight requests
  private async getWithDedupe<T>(cacheKey: string, fetchFn: () => Promise<T>): Promise<T> {
    // If data is in cache, return it
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as T;
    }
    
    // If there's already a request in flight for this key, return that promise
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }
    
    // Otherwise, make a new request and cache both the promise and the result
    const promise = fetchFn().then(data => {
      this.cache.set(cacheKey, data);
      this.pendingRequests.delete(cacheKey);
      return data;
    }).catch(err => {
      this.pendingRequests.delete(cacheKey);
      throw err;
    });
    
    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  async getLicenses(): Promise<Mt4Licence[]> {
    return this.getWithDedupe("licenses", () => this.apiService.getLicenses());
  }

  async getClients(): Promise<Mt4Client[]> {
    return this.getWithDedupe("clients", () => this.apiService.getClients());
  }

  async getProducts(): Promise<Mt4Product[]> {
    return this.getWithDedupe("products", () => this.apiService.getProducts());
  }
  
  // Method to clear all cache
  clearCache() {
    this.cache = new Cache(120000);
    this.pendingRequests.clear();
  }
}

export default new CacheDecorator(ApiService, 120000);