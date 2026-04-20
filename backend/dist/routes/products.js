"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Zod schema for creating product
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be greater than 0'),
    quantity: zod_1.z.number().int().nonnegative('Quantity cannot be negative').default(0),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
    status: zod_1.z.enum(['active', 'inactive']).default('active'),
});
// Protect product routes
router.use(auth_1.authenticate);
// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});
// Create product
router.post('/', async (req, res) => {
    try {
        const data = productSchema.parse(req.body);
        const product = await prisma_1.default.product.create({
            data,
            include: { category: true }
        });
        res.status(201).json(product);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: 'Error creating product' });
    }
});
exports.default = router;
