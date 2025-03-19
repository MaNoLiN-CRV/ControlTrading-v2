import type { Request, Response, NextFunction } from 'express';
import type { roles } from '../entities/user.entity';

const authorization = (roles: roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
    next();
  };
};

export default authorization;
