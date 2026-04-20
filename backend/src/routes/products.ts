import { Router } from 'express';
import prisma from '../prisma';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Zod schema for creating product
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().nonnegative('Quantity cannot be negative').default(0),
  categoryId: z.string().uuid('Invalid category ID'),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Protect product routes
router.use(authenticate);

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({
      data,
      include: { category: true }
    });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
       return res.status(400).json({ errors: (error as any).errors });
    }
    res.status(500).json({ error: 'Error creating product' });
  }
});

export default router;
