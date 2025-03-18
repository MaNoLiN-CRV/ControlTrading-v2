import 'express';
import { Cliente } from './client.entity';

declare module 'express' {
  interface Request {
    user?: any;
    cliente?: Cliente;
  }
}
