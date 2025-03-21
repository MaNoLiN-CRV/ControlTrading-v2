import jwt from 'jsonwebtoken';
import pool from '../../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
import { Cacheable } from '../../cache/cacheable';

dotenv.config();

interface AuthUser {
  id: number;
  username: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
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
  
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
        // Search for user in database
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM clientes WHERE user = ? LIMIT 1`,
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
      if (user?.pass !== password) {
        return { 
          success: false, 
          message: 'Invalid username or password' 
        };
      }
      
      // Create JWT token
      const authUser: AuthUser = {
        id: user.id,
        username: user.user,
        role: user.role
      };
      
      const token = jwt.sign(
        authUser, 
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '5h' }
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
      console.error('Token verification error:', error);
      return {
        valid: false
      };
    }
  }
}