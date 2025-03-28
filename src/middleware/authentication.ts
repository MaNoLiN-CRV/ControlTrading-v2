import type { Request, Response, NextFunction } from 'express';
import type { AuthUser } from '../entities/user.entity';
import { AuthService } from '../services/auth/auth.service';
import logService from '../services/log.service';

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  console.log('⭐ Authentication middleware start');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logService.warn('Authentication failed: Missing or invalid token', { ip: req.ip });
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
      logService.warn('Authentication failed: Invalid token', { ip: req.ip, token });
      res.status(401).json({ message: 'Invalid authentication token' });
      return;
    }

    logService.info('Authentication successful', { user, ip: req.ip });
    req.user = user as AuthUser;
    console.log('➡️ Proceeding to next middleware/controller');
    next();
  } catch (error) {
    logService.error('Authentication error', { error, ip: req.ip });
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authentication;
