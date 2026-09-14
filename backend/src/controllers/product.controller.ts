import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { addProductRequest, updateProductRequest } from '../validators/product.validator';

export const productController = {
  create: async (req: Request, res: Response) => {
    try {
      const { error, data } = addProductRequest.safeParse(req.body);
      if (error) {
        return res.status(400).json({ error: error.errors[0].message });
      }

      const product = await productService.create(req.user!.userId, data);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  findAll: async (req: Request, res: Response) => {
    try {
      const products = await productService.findAll(req.user!.userId);
      res.json(products);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  findById: async (req: Request, res: Response) => {
    try {
      const product = await productService.findById(req.user!.userId, req.params.id);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { error, data } = updateProductRequest.safeParse(req.body);
      if (error) {
        return res.status(400).json({ error: error.errors[0].message });
      }

      const product = await productService.update(req.user!.userId, req.params.id, data);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await productService.delete(req.user!.userId, req.params.id);
      res.json({ message: 'Product deleted' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
};
