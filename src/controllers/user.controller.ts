import type { Request, Response } from 'express';

interface LoginRequest {
  username: string;
  password: string;
}


const login = (req: Request, res: Response) => {
  const { username, password }: LoginRequest = req.body;
  
}


export { login };