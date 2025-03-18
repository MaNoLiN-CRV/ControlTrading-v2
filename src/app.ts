import express from 'express';
import userRoutes from './routes/user.routes';

const app = express();

// Middlewares
app.use(express.json());

// routes
app.use('/api', userRoutes);

export default app;
