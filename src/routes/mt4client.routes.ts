import { Router } from 'express';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/mt4client.controller';

const clientsRouter = Router();

clientsRouter.get('/',getAllClients);
clientsRouter.get('/:id', getClientById);
clientsRouter.post('/', createClient);
clientsRouter.put('/:id', updateClient);
clientsRouter.delete('/:id', deleteClient);

export default clientsRouter;