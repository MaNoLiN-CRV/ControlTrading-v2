import ApiFactory from "@/fetcher/ApiFactory";
import Licence from "@/entities/Licence";
import Client from "@/entities/Client";
import Product from "@/entities/Product";

class ApiService {
  private api = ApiFactory.createApiFactory("Fetch", "http://localhost:3000/api");
  async getLicenses(): Promise<Licence[]> {
    const response = await this.api.get<Licence[]>("/licenses");
    return response.data;
  }

  async getClients(): Promise<Client[]> {
    const response = await this.api.get<Client[]>("/clients");
    return response.data;
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.api.get<Product[]>("/products");
    return response.data;
  }

}

export default new ApiService();