import type { Request, Response } from 'express';
import { Mt4ClientService } from '../services/entities.services/mt4client.service';
import { Mt4LicenceService } from '../services/entities.services/mt4licence.service';
import { Mt4Licence2Service } from '../services/entities.services/mt4licence2.service';
import { Mt4ProductService } from '../services/entities.services/mt4product.service';

export const expireOff = async (req: Request, res: Response) => {
    try {
      const { mt4, name, product, broker, check } = req.query as {
        mt4: string;
        name: string;
        product: string;
        broker: string;
        check: string;
      };
  
      // Validate required parameters
      if (!mt4 || !name || !product || !broker || !check) {
        res.send('\n');
        return;
      }
  
      // Get instance of services
      const clientService = Mt4ClientService.getInstance();
      const productService = Mt4ProductService.getInstance();
      const licenceService = Mt4LicenceService.getInstance();
      const licence2Service = Mt4Licence2Service.getInstance();
  
      // Insert client if not exists
      const client = await clientService.findByMT4ID(mt4) || 
        await clientService.create({
          MT4ID: mt4,
          Nombre: name,
          Broker: broker,
          Tests: check,
          idShop: 1
        });
  
      // Insert/get product
      const productEntity = await productService.findByCode(product) ||
        await productService.create({
          Product: product,
          Code: product,
          version: 1,
          idShop: 1,
          DemoDays: 1,
          link: '',
          comentario: ''
        });
  
      // Handle licences based on product type
      let expiration = '';
      
      if (product.includes('mk')) {
        // Trader-Station licenses
        const licence = await licence2Service.findByMT4IDAndProduct(mt4, productEntity.idProduct!);
        if (licence) {
          const today = new Date();
          const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          expiration = firstDayNextMonth.toISOString().split('T')[0]?.replace(/-/g, '.') || '';
        }
      } else {
        // Standard licenses
        let licence = await licenceService.findByClientAndProduct(client.idClient!, productEntity.idProduct!);
        
        if (!licence) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + productEntity.DemoDays);
          
          licence = await licenceService.create({
            idClient: client.idClient!,
            idProduct: productEntity.idProduct!,
            expiration: expirationDate,
            idShop: 1
          });
        }
        
        expiration = new Date(licence.expiration).toISOString().split('T')[0]?.replace(/-/g, '.')  || '';
      }
  
      if (!expiration) {
        res.send('\n'); // Empty response 
        return;
      }
  
      // Calculate hash 
      const str = `PIP${product}${mt4}${expiration}`;
      let s1 = 1n, s2 = 0n;
      
      for (let i = 0; i < str.length; i++) {
        s1 = (s1 + BigInt(str.charCodeAt(i))) % 65521n;
        s2 = (s2 + s1) % 65521n;
      }
      
      const hash = ((s2 << 16n) + s1).toString() + '_';
  
      // Return response
      res.send(`${expiration}\n${hash}`);
  
    } catch (error) {
      console.error('Error in expireOff:', error);
      res.send('\n'); // Empty response on error
    }
  };