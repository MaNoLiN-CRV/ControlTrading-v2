import { Router } from 'express';
import { login, verifyToken } from '../controllers/auth.controller';
import authentication from '../middleware/authentication';
const router = Router();

router.post('/login', login);
router.get('/verify', authentication, (req, res) => {
  res.status(200).json({ isValid: true });
});

export default router;
