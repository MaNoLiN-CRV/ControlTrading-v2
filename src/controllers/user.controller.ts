import type { Request, Response } from 'express';


const login = (req: Request, res: Response) => {
  res.json({ message: 'User logged in' });
}


export { login };