import jwt from 'jsonwebtoken';
import { cache } from '../../cache/cache';
import pool from '../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export class AuthService {
  private static instance: AuthService;
  
  private constructor() {
  }
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  async login(username: string, password: string): Promise<{ success: boolean; token?: string; user?: AuthUser; message?: string }> {
    try {
        // Search for user in database
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM users WHERE username = ? LIMIT 1`,
        [username]
      );
      
      if (rows.length === 0) {
        return { 
          success: false, 
          message: 'Invalid username or password' 
        };
      }
      
      const user = rows[0];
      
      // TODO - Hash password and compare
      if (user?.password !== password) {
        return { 
          success: false, 
          message: 'Invalid username or password' 
        };
      }
      
      // Create JWT token
      const authUser: AuthUser = {
        id: user.id,
        username: user.username,
        role: user.role
      };
      
      const token = jwt.sign(
        authUser, 
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '24h' }
      );
      
      return {
        success: true,
        token,
        user: authUser
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }

  verifyToken(token: string): { valid: boolean; user?: any } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      return {
        valid: true,
        user: decoded
      };
    } catch (error) {
      return {
        valid: false
      };
    }
  }
}