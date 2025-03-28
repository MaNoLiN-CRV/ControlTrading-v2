import rateLimit from 'express-rate-limit';
import logService from './log.service';

export const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  handler: (req, res) => {
    logService.warn('Rate limit exceeded', { ip: req.ip });
    res.status(429).json({ message: 'Too many requests, please try again later' });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8, // Limit each IP to 8 login attempts per windowMs
  handler: (req, res) => {
    logService.warn('Rate limit exceeded for login', { ip: req.ip });
    res.status(429).json({ message: 'Too many login attempts, please try again later' });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const expireOffLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Allow 30 requests
  message: '\n', // Empty response as per original endpoint
  standardHeaders: true,
  legacyHeaders: false,
});