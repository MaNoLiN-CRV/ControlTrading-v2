import { Router } from 'express';
import {
  getAllLicences,
  getLicenceById,
  createLicence,
  updateLicence,
  deleteLicence,
} from '../controllers/licence.controller';

const licenceRoutes = Router();

// Obtener todas las licencias
licenceRoutes.get('/', getAllLicences);

// Obtener una licencia por ID
licenceRoutes.get('/:id', getLicenceById);

// Crear una nueva licencia
licenceRoutes.post('/', createLicence);

// Actualizar una licencia existente
licenceRoutes.put('/:id', updateLicence);

// Eliminar una licencia
licenceRoutes.delete('/:id', deleteLicence);

export default licenceRoutes;