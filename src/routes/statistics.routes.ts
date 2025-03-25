import { Router } from 'express';
import { 
  getOverviewStats, 
  getProductsUsage, 
  getMonthlyLicences 
} from '../controllers/statistics.controller';

const statisticsRoutes = Router();

// Get overview statistics
statisticsRoutes.get('/overview', getOverviewStats);

// Get products usage statistics
statisticsRoutes.get('/products-usage', getProductsUsage);

// Get monthly licence statistics
statisticsRoutes.get('/monthly-licences', getMonthlyLicences);

export default statisticsRoutes;