import type { Mt4Product } from '../../entities/mt4product.entity';
import type { BaseService } from './base.service';
import pool from '../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Cacheable } from '../../cache/cacheable';
import { cache } from '../../cache/cache';

export class Mt4ProductService implements BaseService<Mt4Product> {
  private static instance: Mt4ProductService;
  private table = 'mt4products';
  
  private constructor() {
    // Private constructor to prevent instantiation
  }
  
  public static getInstance(): Mt4ProductService {
    if (!Mt4ProductService.instance) {
      Mt4ProductService.instance = new Mt4ProductService();
    }
    return Mt4ProductService.instance;
  }
  
  @Cacheable('products:all')
  async findAll(): Promise<Mt4Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);
    return rows as Mt4Product[];
  }

  @Cacheable('product:byId')
  async findById(id: number): Promise<Mt4Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE idProduct = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Product;
  }

  @Cacheable('product:byCode')
  async findByCode(code: string): Promise<Mt4Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE Code = ?`,
      [code]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Product;
  }

  async create(product: Mt4Product): Promise<Mt4Product> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO ${this.table} (Product, Code, version, idShop, DemoDays, link, comentario) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product.Product, product.Code, product.version, product.idShop, 
       product.DemoDays, product.link, product.comentario]
    );
    
    return {
      ...product,
      idProduct: result.insertId
    };
  }

  async update(id: number, product: Partial<Mt4Product>): Promise<boolean> {
    // Dynamic update query based on provided fields
    const entries = Object.entries(product).filter(([key]) => key !== 'idProduct');
    
    if (entries.length === 0) {
      return false;
    }
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE ${this.table} SET ${setClause} WHERE idProduct = ?`,
      [...values, id]
    );
    
    if (result.affectedRows > 0) {
      this.invalidateCache(id);
      this.invalidateCacheAll();
    }
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM ${this.table} WHERE idProduct = ?`,
      [id]
    );
    if (result.affectedRows > 0) {
      this.invalidateCache(id);
      this.invalidateCacheAll();
    }
    return result.affectedRows > 0;
  }

  private invalidateCache(id: number): void {
    // Invalidate cache for all queries that include the client ID
    cache.del(`product:byId:${id}`);
    cache.del(`product:byCode:${id}`);
  }
  private invalidateCacheAll(): void {
    // Invalidate cache for all queries that include the client ID
    cache.del(`products:all`);
  }
}