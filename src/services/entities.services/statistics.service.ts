import { cache } from '../../cache/cache';
import { Cacheable } from '../../cache/cacheable';
import pool from '../../config/database';
import type { RowDataPacket } from 'mysql2';

interface StatsOverview {
  activeLicences: number;
  totalLicences: number;
  totalProducts: number;
  totalClients: number;
}

export class StatisticsService {
  private static instance: StatisticsService;
  
  private constructor() {}
  
  public static getInstance(): StatisticsService {
    if (!StatisticsService.instance) {
      StatisticsService.instance = new StatisticsService();
    }
    return StatisticsService.instance;
  }

  @Cacheable('stats:overview')
  async getOverviewStats(): Promise<StatsOverview> {
    const today = new Date().toISOString().split('T')[0];

    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT 
        (SELECT COUNT(*) FROM mt4licences WHERE expiration >= ?) as activeLicences,
        (SELECT COUNT(*) FROM mt4licences) as totalLicences,
        (SELECT COUNT(*) FROM mt4products) as totalProducts,
        (SELECT COUNT(*) FROM mt4clients) as totalClients
    `, [today]);

    return results[0] as StatsOverview;
  }

  @Cacheable('stats:productsUsage')
  async getProductsUsage(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];

    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT 
        p.Product,
        p.Code,
        COUNT(l.idLicence) as totalLicences,
        SUM(CASE WHEN l.expiration >= ? THEN 1 ELSE 0 END) as activeLicences
      FROM mt4products p
      LEFT JOIN mt4licences l ON p.idProduct = l.idProduct
      GROUP BY p.idProduct, p.Product, p.Code
      ORDER BY activeLicences DESC
    `, [today]);

    return results;
  }

  @Cacheable('stats:monthlyLicences')
  async getMonthlyLicences(): Promise<any[]> {
    const [results] = await pool.query<RowDataPacket[]>(`
      SELECT 
        DATE_FORMAT(expiration, '%Y-%m') as month,
        COUNT(*) as totalLicences
      FROM mt4licences
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `);

    return results;
  }

  private invalidateCache(): void {
    cache.del('stats:overview');
    cache.del('stats:productsUsage');
    cache.del('stats:monthlyLicences');
  }
}