import { Router } from 'express';
import {
  getAllLicences,
  getLicenceById,
  getLicencesByMT4ID,
  getLicenceByMT4IDAndProduct,
  createLicence,
  updateLicence,
  deleteLicence,
} from '../controllers/mt4licence2.controller.ts';

const licence2Routes = Router();

// Get all licences
licence2Routes.get('/', getAllLicences);

// Get licence by ID
licence2Routes.get('/id/:id', getLicenceById);

// Get licences by MT4ID
licence2Routes.get('/mt4id/:mt4id', getLicencesByMT4ID);

// Get licence by MT4ID and Product
licence2Routes.get('/mt4id/:mt4id/product/:productId', getLicenceByMT4IDAndProduct);

// Create new licence
licence2Routes.post('/', createLicence);

// Update existing licence
licence2Routes.put('/:id', updateLicence);

// Delete licence
licence2Routes.delete('/:id', deleteLicence);

export default licence2Routes;