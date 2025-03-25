import type { Request, Response } from 'express';
import { StatisticsService } from '../services/entities.services/statistics.service';

const statisticsService = StatisticsService.getInstance();

export const getOverviewStats = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getOverviewStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};

export const getProductsUsage = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getProductsUsage();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching products usage:', error);
    res.status(500).json({ message: 'Error fetching products usage', error });
  }
};

export const getMonthlyLicences = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getMonthlyLicences();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching monthly licences:', error);
    res.status(500).json({ message: 'Error fetching monthly statistics', error });
  }
};