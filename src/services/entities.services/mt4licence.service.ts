import { cache } from '../../cache/cache';
import { Cacheable } from '../../cache/cacheable';
import type { Mt4Licence } from '../../entities/mt4licence.entity';
import type { BaseService } from './base.service';
import pool from '../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class Mt4LicenceService implements BaseService<Mt4Licence> {
  private static instance: Mt4LicenceService;
  private table = 'mt4licences';
  
  private constructor() {
    // Private constructor to prevent instantiation
  }
  
  public static getInstance(): Mt4LicenceService {
    if (!Mt4LicenceService.instance) {
      Mt4LicenceService.instance = new Mt4LicenceService();
    }
    return Mt4LicenceService.instance;
  }

  @Cacheable('licences:all')
  async findAll(): Promise<Mt4Licence[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);
    return rows as Mt4Licence[];
  }

  @Cacheable('licence:byId')
  async findById(id: number): Promise<Mt4Licence | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE idLicence = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Licence;
  }

  @Cacheable('licences:byClientId')
  async findByClientId(clientId: number): Promise<Mt4Licence[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE idClient = ?`,
      [clientId]
    );
    
    return rows as Mt4Licence[];
  }

  @Cacheable('licence:byClientAndProduct')
  async findByClientAndProduct(clientId: number, productId: number): Promise<Mt4Licence | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE idClient = ? AND idProduct = ?`,
      [clientId, productId]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Licence;
  }

  async create(licence: Mt4Licence): Promise<Mt4Licence> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO ${this.table} (idClient, idProduct, expiration, idShop) 
       VALUES (?, ?, ?, ?)`,
      [licence.idClient, licence.idProduct, licence.expiration, licence.idShop]
    );
    
    // Invalidate cache
    this.invalidateCache(licence.idClient);
    
    return {
      ...licence,
      idLicence: result.insertId
    };
  }

  async update(id: number, licence: Partial<Mt4Licence>): Promise<boolean> {
    console.log('Updating licence:', id, licence);
    
    // Handle date formatting for both Date objects and ISO strings
    if (licence.expiration) {
      console.log('Converting date to MySQL format');
      const date = licence.expiration instanceof Date 
        ? licence.expiration 
        : new Date(licence.expiration);
      
      // Format date as YYYY-MM-DD
      licence.expiration = date.toISOString().split('T')[0];
    }
  
    const entries = Object.entries(licence).filter(([key]) => key !== 'idLicence');
    if (entries.length === 0) {
      return false;
    }
  
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => value);
  
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE ${this.table} SET ${setClause} WHERE idLicence = ?`,
        [...values, id]
      );
  
      // Invalidate cache if update was successful
      if (result.affectedRows > 0 && licence.idClient) {
        this.invalidateCache(licence.idClient);
      }
  
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating licence:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    // Get the licence to know which client's cache to invalidate
    const licence = await this.findById(id);
    
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM ${this.table} WHERE idLicence = ?`,
      [id]
    );
    
    // Invalidate cache
    if (result.affectedRows > 0 && licence) {
      this.invalidateCache(licence.idClient);
    }
    
    return result.affectedRows > 0;
  }

  /**
   * Invalidate relevant cache entries
   */
  private invalidateCache(clientId?: number): void {
    cache.del('activeLicences');
    cache.del('licences:all');
    if (clientId) {
      cache.del(`clientWithLicences:${JSON.stringify([clientId])}`);
    } else {
      // If no client ID is provided, clear all client-related cache entries
      const keys = Object.keys(cache).filter(key => key.startsWith('clientWithLicences:'));
      keys.forEach(key => cache.del(key));
    }
  }
}