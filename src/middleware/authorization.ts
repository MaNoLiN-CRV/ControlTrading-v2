import type { Request, Response, NextFunction } from 'express';

const authorization = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !requiredRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

export default authorization;
