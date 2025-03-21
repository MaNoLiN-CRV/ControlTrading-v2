import express from 'express';
import authRoutes from './routes/auth.routes';
import mt4ClientRoutes from './routes/mt4client.routes';
import tradingRoutes from './routes/trading.routes';
import mt4productRoutes from './routes/mt4product.routes';
import cacheRoutes from './routes/cache.routes';
import licenceRoutes from './routes/licence.routes';
import authentication from './middleware/authentication';
import authorization from './middleware/authorization';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());
// Enable CORS
app.use(cors());

// Routes
app.use('/api', authRoutes);
app.use('/api/clients', authentication, mt4ClientRoutes);
app.use('/api/trading', authentication , tradingRoutes);
app.use('/api/products', authentication, mt4productRoutes);
app.use('/api/cache', authentication, cacheRoutes);
app.use('/api/licences', licenceRoutes);

export default app;
