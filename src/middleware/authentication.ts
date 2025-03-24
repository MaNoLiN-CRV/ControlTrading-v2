import type { Request, Response, NextFunction } from 'express';
import type { AuthUser } from '../entities/user.entity';
import { AuthService } from '../services/auth/auth.service';

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  console.log('⭐ Authentication middleware start');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No token provided or invalid format');
    res.status(401).json({ message: 'Authentication token is missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1] || '';
  console.log('🔑 Token received:', token.substring(0, 20) + '...');

  try {
    const authService = AuthService.getInstance();
    console.log('🔐 Verifying token...');
    const { valid, user } = authService.verifyToken(token);

    if (!valid || !user) {
      console.log('❌ Token validation failed');
      res.status(401).json({ message: 'Invalid authentication token' });
      return;
    }

    console.log('✅ Token valid, user:', user);
    req.user = user as AuthUser;
    console.log('➡️ Proceeding to next middleware/controller');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authentication;
