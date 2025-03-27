import express from 'express';
import rateLimit from 'express-rate-limit';
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

// Serve static files
app.use(express.static('public'));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Special limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8, // Limit each IP to 8 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Special limiter for expireOff endpoint
const expireOffLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // Allow 30 requests 
  message: '\n', // Empty response as per original endpoint
  standardHeaders: true,
  legacyHeaders: false,
});

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: true, 
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Apply rate limiting to all routes
app.use(limiter);

// Basic Middlewares
app.use(express.json());
app.use(cors());

// Routes with specific rate limits
app.use('/api/login', authLimiter, authRoutes);
app.use('/api/clients', authentication, mt4ClientRoutes);
app.use('/api/trading', authentication, tradingRoutes);
app.use('/api/products', authentication, mt4productRoutes);
app.use('/api/cache', authentication, cacheRoutes);
app.use('/api/licences', authentication, licenceRoutes);
app.use('/api/statistics', authentication, statisticsRoutes);
app.use('/api/licences2', authentication, licence2Routes);

// special rate limit to expireOff endpoint
app.use('/expireOff.aspx', expireOffLimiter);
app.use('', expirationRoutes); // Old compatibility route

export default app;
