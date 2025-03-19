import type { Request, Response } from 'express';
import { cache } from '../cache/cache';

export const getCacheStats = (req: Request, res: Response) => {
  const stats = {
    keys: Object.keys(cache),
    totalItems: Object.keys(cache).length,
    memory: process.memoryUsage()
  };
  
  res.status(200).json(stats);
};

export const clearCache = (req: Request, res: Response) => {
  cache.flush();
  res.status(200).json({ message: 'Cache cleared successfully' });
};