import { Router } from 'express';
import { getActiveLicences, getClientWithLicences, registerClientWithLicence } from '../controllers/trading.controller';

const tradingRoutes = Router();

tradingRoutes.get('/active-licences', getActiveLicences);
tradingRoutes.get('/client/:clientId', getClientWithLicences);
tradingRoutes.post('/register', registerClientWithLicence);

export default tradingRoutes;