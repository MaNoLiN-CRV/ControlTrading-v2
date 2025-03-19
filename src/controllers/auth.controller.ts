import type { Request, Response } from 'express';
import { AuthService } from '../services/auth/auth.service';

interface LoginRequest {
  username: string;
  password: string;
}

const authService = AuthService.getInstance();

const login = (req: Request, res: Response) => {
  const { username, password }: LoginRequest = req.body;
  authService.login(username, password)
    .then((response) => {
      if (response.success) {
        res.status(200).json(response);
      }
      else {
        res.status(401).json(response.message);
      }
    }, (error) => {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  );
}


export { login };