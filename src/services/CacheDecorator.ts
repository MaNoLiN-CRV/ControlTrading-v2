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
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as T;
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }

    const promise = fetchFn()
      .then((data) => {
        this.cache.set(cacheKey, data);
        this.pendingRequests.delete(cacheKey);
        return data;
      })
      .catch((err) => {
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

  async updateLicence(licence: Mt4Licence): Promise<Mt4Licence> {
    const updatedLicence = await this.apiService.updateLicence(licence);
    this.invalidateCache("licenses"); // Invalidate licenses cache
    return updatedLicence;
  }

  async updateClient(client: Mt4Client): Promise<Mt4Client> {
    const updatedClient = await this.apiService.updateClient(client);
    this.invalidateCache("clients"); // Invalidate clients cache
    return updatedClient;
  }

  async updateProduct(product: Mt4Product): Promise<Mt4Product> {
    const updatedProduct = await this.apiService.updateProduct(product);
    this.invalidateCache("products"); // Invalidate products cache
    return updatedProduct;
  }

  async updateProductDemoDays(id: number, demoDays: number): Promise<void> {
    await this.apiService.updateProductDemoDays(id, demoDays);
    this.invalidateCache("products"); // Invalidate products cache
  }

  // Method to invalidate a specific cache entry
  invalidateCache(cacheKey: string): void {
    if (this.cache.has(cacheKey)) {
      this.cache.delete(cacheKey);
    }
  }

  // Method to clear all cache
  clearCache() {
    this.cache = new Cache(120000);
    this.pendingRequests.clear();
  }
}

export default new CacheDecorator(ApiService, 120000);