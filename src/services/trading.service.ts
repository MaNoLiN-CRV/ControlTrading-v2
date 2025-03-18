import { Cacheable } from '../cache/cacheable';
import pool from '../config/database';
import type { Mt4Client } from '../entities/mt4client.entity';
import type { Mt4Licence } from '../entities/mt4licence.entity';
import type { Mt4Product } from '../entities/mt4product.entity';
import { Mt4ClientService } from './mt4client.service';
import { Mt4LicenceService } from './mt4licence.service';
import { Mt4ProductService } from './mt4product.service';

export class TradingService {
  private clientService = new Mt4ClientService();
  private licenceService = new Mt4LicenceService();
  private productService = new Mt4ProductService();

  /**
   * Get all active licences with client and product details
   */
  @Cacheable('activeLicences')
  async getActiveLicences(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    
    // Using a join query for better performance
    const [rows]: [any[], any] = await pool.query(`
      SELECT l.*, c.MT4ID, c.Nombre, c.Broker, p.Product, p.Code 
      FROM mt4licences l
      JOIN mt4clients c ON l.idClient = c.idClient
      JOIN mt4products p ON l.idProduct = p.idProduct
      WHERE l.expiration >= ?
    `, [today]);
    
    return rows;
  }

  /**
   * Get client with all active licences
   */
  @Cacheable('clientWithLicences')
  async getClientWithLicences(clientId: number): Promise<any> {
    const client = await this.clientService.findById(clientId);
    
    if (!client) {
      return null;
    }
    
    const licences = await this.licenceService.findByClientId(clientId);
    const today = new Date();
    
    // Filter active licences and add product details
    const activeLicences = [];
    
    for (const licence of licences) {
      if (new Date(licence.expiration) >= today) {
        const product = await this.productService.findById(licence.idProduct);
        
        if (product) {
          activeLicences.push({
            ...licence,
            product
          });
        }
      }
    }
    
    return {
      ...client,
      licences: activeLicences
    };
  }

  /**
   * Register new client with a product licence
   */
  async registerClientWithLicence(
    client: Mt4Client, 
    productId: number, 
    expirationDays: number
  ): Promise<any> {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Check if client already exists
      const existingClient = await this.clientService.findByMT4ID(client.MT4ID);
      
      let clientId: number;
      
      if (existingClient) {
        clientId = existingClient.idClient as number;
      } else {
        // Create new client
        const newClient = await this.clientService.create(client);
        clientId = newClient.idClient as number;
      }
      
      // Check if product exists
      const product = await this.productService.findById(productId);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      // Calculate expiration date
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expirationDays);
      
      // Create licence
      const licence: Mt4Licence = {
        idClient: clientId,
        idProduct: productId,
        expiration: expirationDate,
        idShop: client.idShop
      };
      
      const newLicence = await this.licenceService.create(licence);
      
      await connection.commit();
      
      return {
        client: existingClient || { ...client, idClient: clientId },
        licence: { ...newLicence, product }
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}