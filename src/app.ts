import express from 'express';
import { generalLimiter, authLimiter, expireOffLimiter } from './services/rateLimiter.service';
import authRoutes from './routes/auth.routes';
import mt4ClientRoutes from './routes/mt4client.routes';
import tradingRoutes from './routes/trading.routes';
import mt4productRoutes from './routes/mt4product.routes';
import cacheRoutes from './routes/cache.routes';
import licenceRoutes from './routes/licence.routes';
import statisticsRoutes from './routes/statistics.routes';
import authentication from './middleware/authentication';
import licence2Routes from './routes/mt4licence2.routes';
import expirationRoutes from './routes/expiration.routes';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, 
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Basic Middlewares
app.use(express.json());
app.use(cors());

// Apply general rate limiter
app.use(generalLimiter);

// Routes with specific rate limits
app.use('/api/', authRoutes);
app.use('/api/clients', authentication, mt4ClientRoutes);
app.use('/api/trading', authentication, tradingRoutes);
app.use('/api/products', authentication, mt4productRoutes);
app.use('/api/cache', authentication, cacheRoutes);
app.use('/api/licences', authentication, licenceRoutes);
app.use('/api/statistics', authentication, statisticsRoutes);
app.use('/api/licences2', authentication, licence2Routes);

// Special rate limit for expireOff endpoint
app.use(expireOffLimiter, expirationRoutes);

// Serve static files 
app.use('/', express.static('public'));

// Add a specific route for the root path
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

export default app;
