import type { Request, Response } from 'express';
import { Mt4ProductService } from '../services/entities.services/mt4product.service';

const productService = Mt4ProductService.getInstance();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.findAll();
    console.log('Get all products controller');
    res.status(200).json(products);
  } catch (error) {
    console.log('Error fetching products', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.findById(Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return; 
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

export const getProductByCode = async (req: Request, res: Response) => {
  try {
    const code = req.params.code ?? '';
    const product = await productService.findByCode(code);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return; 
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await productService.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await productService.update(Number(req.params.id), req.body);
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await productService.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};