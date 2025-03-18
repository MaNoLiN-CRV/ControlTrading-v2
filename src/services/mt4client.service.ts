import type { Mt4Client } from '../entities/mt4client.entity';
import type { BaseService } from './base.service';
import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class Mt4ClientService implements BaseService<Mt4Client> {
  private table = 'mt4clients';
  
  async findAll(): Promise<Mt4Client[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${this.table}`);
    return rows as Mt4Client[];
  }

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
    
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM ${this.table} WHERE idClient = ?`,
      [id]
    );
    
    return result.affectedRows > 0;
  }
}