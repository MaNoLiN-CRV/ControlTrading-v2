import ApiFactory from "@/fetcher/ApiFactory";
import { Mt4Client, Mt4Licence, Mt4Product } from "@/entities/entities/client.entity";

class ApiService {
  private api = ApiFactory.createApiFactory("Fetch", "http://localhost:3000/api");

  async getLicenses(): Promise<Mt4Licence[]> {
    const response = await this.api.get<Mt4Licence[]>("/licenses");
    return response.data;
  }

  async getClients(): Promise<Mt4Client[]> {
    const response = await this.api.get<Mt4Client[]>("/clients");
    return response.data;
  }

  async getProducts(): Promise<Mt4Product[]> {
    const response = await this.api.get<Mt4Product[]>("/products/");
    return response.data;
  }
}

export default new ApiService();