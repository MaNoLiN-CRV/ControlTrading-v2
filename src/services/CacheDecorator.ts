import ApiService from "./ApiService";
import { Mt4Client, Mt4Licence, Mt4Product } from "@/entities/entities/client.entity";
import Cache from "./Cache";

class CacheDecorator {
  private apiService: typeof ApiService;
  private cache: Cache<any>;

  constructor(apiService: typeof ApiService, ttl: number) {
    this.apiService = apiService;
    this.cache = new Cache(ttl);
  }

  async getLicenses(): Promise<Mt4Licence[]> {
    const cacheKey = "licenses";
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const data = await this.apiService.getLicenses();
    this.cache.set(cacheKey, data);
    return data;
  }

  async getClients(): Promise<Mt4Client[]> {
    const cacheKey = "clients";
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const data = await this.apiService.getClients();
    this.cache.set(cacheKey, data);
    return data;
  }

  async getProducts(): Promise<Mt4Product[]> {
    const cacheKey = "products";
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const data = await this.apiService.getProducts();
    this.cache.set(cacheKey, data);
    return data;
  }
}

export default new CacheDecorator(ApiService, 120000);