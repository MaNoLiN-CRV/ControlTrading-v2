import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

export default authentication;
