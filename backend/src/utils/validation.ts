import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  description: z.string().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  status: z.enum(['active', 'inactive']).default('active'),
  sortOrder: z.number().int().optional().default(0),
  iconColor: z.string().max(7).optional().nullable()
});

export const CategoryUpdateSchema = CategorySchema.partial();

export const CategoryStatusSchema = z.object({
  status: z.enum(['active', 'inactive'])
});
