import express from 'express';
import authRoutes from './routes/auth.routes';
import mt4ClientRoutes from './routes/mt4client.routes';
import tradingRoutes from './routes/trading.routes';
import cacheRoutes from './routes/cache.routes';
import authentication from './middleware/authentication';
import authorization from './middleware/authorization';

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/', authRoutes);
app.use('/api/clients', authentication, authorization(['admin']), mt4ClientRoutes);
app.use('/api/trading',authentication, authorization(['admin']) , tradingRoutes);

// Admin routes with authentication and authorization
app.use('/api/cache', authentication, authorization(['admin']), cacheRoutes);

export default app;
