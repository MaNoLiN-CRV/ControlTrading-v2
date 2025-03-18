import type { Mt4Licence2 } from '../entities/mt4licence2.entity';
import type { BaseService } from './base.service';
import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class Mt4Licence2Service implements BaseService<Mt4Licence2> {
  private table = 'mt4licences2';
  
  async findAll(): Promise<Mt4Licence2[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);
    return rows as Mt4Licence2[];
  }

  async findById(id: number): Promise<Mt4Licence2 | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE idLicence = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Licence2;
  }

  async findByMT4ID(mt4id: string): Promise<Mt4Licence2[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE MT4ID = ?`,
      [mt4id]
    );
    
    return rows as Mt4Licence2[];
  }

  async findByMT4IDAndProduct(mt4id: string, productId: number): Promise<Mt4Licence2 | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE MT4ID = ? AND idProduct = ?`,
      [mt4id, productId]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as Mt4Licence2;
  }

  async create(licence: Mt4Licence2): Promise<Mt4Licence2> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO ${this.table} (MT4ID, idProduct, idShop) 
       VALUES (?, ?, ?)`,
      [licence.MT4ID, licence.idProduct, licence.idShop]
    );
    
    return {
      ...licence,
      idLicence: result.insertId
    };
  }

  async update(id: number, licence: Partial<Mt4Licence2>): Promise<boolean> {
    // Build dynamic update query based on provided fields
    const entries = Object.entries(licence).filter(([key]) => key !== 'idLicence');
    
    if (entries.length === 0) {
      return false;
    }
    
    const setClause = entries.map(([key]) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => value);
    
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE ${this.table} SET ${setClause} WHERE idLicence = ?`,
      [...values, id]
    );
    
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM ${this.table} WHERE idLicence = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }
}