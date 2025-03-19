import type { Request, Response, NextFunction } from 'express';
import type { AuthUser } from '../entities/user.entity';
import { AuthService } from '../services/auth/auth.service';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { valid, user } = AuthService.getInstance().verifyToken(token || '');

    if (!valid || !user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = user as AuthUser;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authentication;
