import { Router } from 'express';
import { getCacheStats, clearCache } from '../controllers/cache.controller';

const cacheRouter = Router();

cacheRouter.get('/', getCacheStats);
cacheRouter.post('/clear', clearCache);

export default cacheRouter;