import 'express';
import { Cliente } from './client.entity';
import { AuthUser } from './user.entity';
declare module 'express' {
  interface Request {
    user?: AuthUser;
    cliente?: Cliente;
  }
}
