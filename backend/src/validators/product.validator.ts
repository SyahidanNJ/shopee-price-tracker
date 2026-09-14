import { z } from 'zod';

export const addProductSchema = z.object({
  sourceUrl: z.string().url()
});

export const updateProductSchema = z.object({
  status: z.enum(['active', 'paused', 'error', 'not_found', 'out_of_stock']).optional(),
  name: z.string().max(500).optional()
});

export const addProductRequest = addProductSchema;
export const updateProductRequest = updateProductSchema;
