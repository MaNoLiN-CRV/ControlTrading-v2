import type { Mt4Licence } from '../entities/mt4licence.entity';
import type { BaseService } from './base.service';
import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class Mt4LicenceService implements BaseService<Mt4Licence> {
  private table = 'mt4licences';
  
  async findAll(): Promise<Mt4Licence[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);
    return rows as Mt4Licence[];
  }

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

  async findByClientId(clientId: number): Promise<Mt4Licence[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM ${this.table} WHERE idClient = ?`,
      [clientId]
    );
    
    return rows as Mt4Licence[];
  }

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
    
    return {
      ...licence,
      idLicence: result.insertId
    };
  }

  async update(id: number, licence: Partial<Mt4Licence>): Promise<boolean> {
    
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