import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import authentication from '../middleware/authentication';
import { authLimiter } from '../services/rateLimiter.service';
import logService from '../services/log.service';
import type { Request, Response } from 'express';

const router = Router();

router.post('/login', authLimiter, (req, res, next) => {
  logService.info('Login attempt', { ip: req.ip, body: req.body });
  next();
}, login);

router.get('/verify', authentication, (req : Request, res : Response) => {
  logService.info('Token verification', { user: req.user, ip: req.ip });
  res.status(200).json({ isValid: true });
});

export default router;
