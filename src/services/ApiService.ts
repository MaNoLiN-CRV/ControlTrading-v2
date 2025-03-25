import api from "@/services/api"; 
import { Mt4Client, Mt4Licence, Mt4Licence2, Mt4Product } from "@/entities/entities/client.entity";
import StatsOverview from "@/entities/StatsOverview";

class ApiService {
  async getLicenses(): Promise<Mt4Licence[]> {
    const response = await api.get<Mt4Licence[]>("/licences");
    return response.data;
  }

  async getClients(): Promise<Mt4Client[]> {
    const response = await api.get<Mt4Client[]>("/clients");
    return response.data;
  }

  async getProducts(): Promise<Mt4Product[]> {
    const response = await api.get<Mt4Product[]>("/products");
    return response.data;
  }
  
  async getStatsOverview(): Promise<StatsOverview> {
    const response = await api.get<StatsOverview>("/statistics/overview");
    return response.data;
  }

  async updateLicence(licence: Mt4Licence): Promise<Mt4Licence> {
    const response = await api.put<Mt4Licence>(`/licences/${licence.idLicence}`, licence);
    return response.data;
  }

  async updateClient(client: Mt4Client): Promise<Mt4Client> {
    const response = await api.put<Mt4Client>(`/clients/${client.idClient}`, client);
    return response.data;
  }

  async updateProduct(product: Mt4Product): Promise<Mt4Product> {
    const response = await api.put<Mt4Product>(`/products/${product.idProduct}`, product);
    return response.data;
  }

  async updateProductDemoDays(id: number, demoDays: number): Promise<Mt4Product> {
    const response = await api.put(`/products/${id}`, { DemoDays: demoDays });
    return response.data;
  }

  async createMt4License2(licence: Mt4Licence2): Promise<Mt4Licence2> {
    const response = await api.post<Mt4Licence2>("/licences2", licence);
    return response.data;
  }

  async updateMt4License2(id: number, mt4id: string): Promise<Mt4Licence2> {
    const response = await api.put<Mt4Licence2>(`/licences2/${id}`, { MT4ID: mt4id });
    return response.data;
  }

  async getMt4Licenses2(): Promise<Mt4Licence2[]> {
    const response = await api.get<Mt4Licence2[]>("/licences2");
    return response.data;
  }

  async deleteMt4License2(id: number): Promise<void> {
    await api.delete(`/licences2/${id}`);
  }

}

export default new ApiService();