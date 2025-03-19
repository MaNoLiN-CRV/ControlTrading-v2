import type { Request, Response } from 'express';
import { Mt4ClientService } from '../services/entities.services/mt4client.service';

const clientService = Mt4ClientService.getInstance();

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await clientService.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await clientService.findById(Number(req.params.id));
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client', error });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const newClient = await clientService.create(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const updated = await clientService.update(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const deleted = await clientService.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error });
  }
};