import { Router } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  getProductByCode,
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/mt4product.controller';

const productRoutes = Router();

// Get all products
productRoutes.get('/', getAllProducts);

// Get product by ID
productRoutes.get('/id/:id', getProductById);

// Get product by code
productRoutes.get('/code/:code', getProductByCode);

// Create new product
productRoutes.post('/', createProduct);

// Update existing product
productRoutes.put('/:id', updateProduct);

// Delete product
productRoutes.delete('/:id', deleteProduct);

export default productRoutes;