import { z } from 'zod';

export const alertSchema = z.object({
  isActive: z.boolean().optional(),
  alertType: z.enum(['any_drop', 'target_price', 'min_drop_percentage']),
  targetPrice: z.number().nullable().optional(),
  minDropPercentage: z.number().nullable().optional(),
  cooldownMinutes: z.number().default(360)
}).refine(
  (data) => {
    if (data.alertType === 'target_price') {
      return data.targetPrice !== null && data.targetPrice !== undefined;
    }
    return true;
  },
  {
    message: 'targetPrice is required for target_price alert type',
    path: ['targetPrice']
  }
).refine(
  (data) => {
    if (data.alertType === 'min_drop_percentage') {
      return data.minDropPercentage !== null && data.minDropPercentage !== undefined;
    }
    return true;
  },
  {
    message: 'minDropPercentage is required for min_drop_percentage alert type',
    path: ['minDropPercentage']
  }
);

export const updateAlertRequest = alertSchema;
