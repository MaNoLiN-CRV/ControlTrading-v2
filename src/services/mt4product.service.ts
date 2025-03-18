import type { Mt4Product } from '../entities/mt4product.entity';
import type { BaseService } from './base.service';
import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class Mt4ProductService implements BaseService<Mt4Product> {
  private table = 'mt4products';
  
  async findAll(): Promise<Mt4Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);
    return rows as Mt4Product[];
  }

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
    
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM ${this.table} WHERE idProduct = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }
}