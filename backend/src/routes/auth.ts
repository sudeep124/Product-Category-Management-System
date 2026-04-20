import { Router } from 'express';
import prisma from '../prisma';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name }
    });
    const token = generateToken(user.id);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: (err as any).errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user.id);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: (err as any).errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
