import ApiFactory from "@/fetcher/ApiFactory";
import { Mt4Client, Mt4Licence, Mt4Product } from "@/entities/entities/client.entity";

class ApiService {
  private api = ApiFactory.createApiFactory("Fetch", "http://localhost:3000/api");

  async getLicenses(): Promise<Mt4Licence[]> {
    const response = await this.api.get<Mt4Licence[]>("/licences");
    return response.data;
  }

  async getClients(): Promise<Mt4Client[]> {
    const response = await this.api.get<Mt4Client[]>("/clients");
    return response.data;
  }

  async getProducts(): Promise<Mt4Product[]> {
    const response = await this.api.get<Mt4Product[]>("/products");
    return response.data;
  }

  async updateLicence(licence: Mt4Licence): Promise<Mt4Licence> {
    const response = await this.api.put<Mt4Licence>(`/licences/${licence.idLicence}`, licence);
    return response.data;
  }

  async updateClient(client: Mt4Client): Promise<Mt4Client> {
    const response = await this.api.put<Mt4Client>(`/clients/${client.idClient}`, client);
    return response.data;
  }

  async updateProduct(product: Mt4Product): Promise<Mt4Product> {
    const response = await this.api.put<Mt4Product>(`/products/${product.idProduct}`, product);
    return response.data;
  }
}

export default new ApiService();