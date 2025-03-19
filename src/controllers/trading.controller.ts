import type { Request, Response } from 'express';
import { TradingService } from '../services/entities.services/trading.service';

const tradingService = TradingService.getInstance();

export const getActiveLicences = async (req: Request, res: Response) => {
  try {
    const licences = await tradingService.getActiveLicences();
    res.status(200).json(licences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active licences', error });
  }
};

export const getClientWithLicences = async (req: Request, res: Response) => {
  try {
    const clientWithLicences = await tradingService.getClientWithLicences(Number(req.params.clientId));
    if (!clientWithLicences) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(clientWithLicences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client with licences', error });
  }
};

export const registerClientWithLicence = async (req: Request, res: Response) => {
  try {
    const { client, productId, expirationDays } = req.body;
    const result = await tradingService.registerClientWithLicence(client, productId, expirationDays);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error registering client with licence', error });
  }
};