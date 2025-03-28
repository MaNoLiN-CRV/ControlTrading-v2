import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import authentication from '../middleware/authentication';
import { authLimiter } from '../services/rateLimiter.service';
const router = Router();

router.post('/login',authLimiter ,login);
router.get('/verify', authentication, (req, res) => {
  res.status(200).json({ isValid: true });
});

export default router;
