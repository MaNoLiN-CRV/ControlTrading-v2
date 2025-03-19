import { cache } from '../../cache/cache';
import { Cacheable } from '../../cache/cacheable';
import type { Mt4Client } from '../../entities/mt4client.entity';
import type { BaseService } from './base.service';
import pool from '../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class Mt4ClientService implements BaseService<Mt4Client> {
  private static instance: Mt4ClientService;
  private table = 'mt4clients';
  
  private constructor() {
    // Private constructor to prevent instantiation
  }
  
  public static getInstance(): Mt4ClientService {
    if (!Mt4ClientService.instance) {
      Mt4ClientService.instance = new Mt4ClientService();
    }
    return Mt4ClientService.instance;
  }

  @Cacheable('clients:all')
  async findAll(): Promise<Mt4Client[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);
    return rows as Mt4Client[];
  }

  @Cacheable('client:byId')
  async findById(id: number): Promise<Mt4Client | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE idClient = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Client;
  }

  @Cacheable('client:byMT4ID')
  async findByMT4ID(mt4id: string): Promise<Mt4Client | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE MT4ID = ?`,
      [mt4id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Client;
  }

  async create(client: Mt4Client): Promise<Mt4Client> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO ${this.table} (MT4ID, Nombre, Broker, Tests, idShop) VALUES (?, ?, ?, ?, ?)`,
      [client.MT4ID, client.Nombre, client.Broker, client.Tests, client.idShop]
    );
    
    // Invalidate cache
    this.invalidateCache();
    
    return {
      ...client,
      idClient: result.insertId
    };
  }

  async update(id: number, client: Partial<Mt4Client>): Promise<boolean> {
    // Build dynamic update query based on provided fields
    const entries = Object.entries(client).filter(([key]) => key !== 'idClient');
    
    if (entries.length === 0) {
      return false;
    }
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE ${this.table} SET ${setClause} WHERE idClient = ?`,
      [...values, id]
    );
    
    // Invalidate cache
    if (result.affectedRows > 0) {
      this.invalidateCache();
    }
    
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM ${this.table} WHERE idClient = ?`,
      [id]
    );
    
    // Invalidate cache
    if (result.affectedRows > 0) {
      this.invalidateCache();
    }
    
    return result.affectedRows > 0;
  }

  /**
   * Invalidate relevant cache entries
   */
  private invalidateCache(): void {
    // Clear any cache entry that might contain client data
    cache.del('activeLicences');
    // Use regex pattern to clear all keys that match 'clientWithLicences:*'
    const keys = Object.keys(cache).filter(key => key.startsWith('clientWithLicences:'));
    keys.forEach(key => cache.del(key));
  }
}