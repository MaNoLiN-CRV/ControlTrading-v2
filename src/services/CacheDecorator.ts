import ApiService from "./ApiService";
import Licence from "@/entities/Licence";
import Client from "@/entities/Client";
import Product from "@/entities/Product";

class CacheDecorator {
  private apiService: typeof ApiService;
  private cache: Map<string, any>;

  constructor(apiService: typeof ApiService) {
    this.apiService = apiService;
    this.cache = new Map();
  }

  async getLicenses(): Promise<Licence[]> {
    const cacheKey = "licenses";
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const data = await this.apiService.getLicenses();
    this.cache.set(cacheKey, data);
    return data;
  }

  async getClients(): Promise<Client[]> {
    const cacheKey = "clients";
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const data = await this.apiService.getClients();
    this.cache.set(cacheKey, data);
    return data;
  }

  async getProducts(): Promise<Product[]> {
    const cacheKey = "products";
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const data = await this.apiService.getProducts();
    this.cache.set(cacheKey, data);
    return data;
  }

  
}

export default new CacheDecorator(ApiService);