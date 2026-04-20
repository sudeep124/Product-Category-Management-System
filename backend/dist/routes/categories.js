"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const validation_1 = require("../utils/validation");
const slugify_1 = require("../utils/slugify");
const router = (0, express_1.Router)();
// GET /categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
// GET /categories/tree
router.get('/tree', async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany();
        const categoryMap = new Map();
        categories.forEach(cat => categoryMap.set(cat.id, { ...cat, children: [] }));
        const tree = [];
        categoryMap.forEach(cat => {
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.children.push(cat);
                    parent.children.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                }
            }
            else {
                tree.push(cat);
            }
        });
        tree.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        res.json(tree);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch category tree' });
    }
});
// POST /categories
router.post('/', async (req, res) => {
    try {
        const data = validation_1.CategorySchema.parse(req.body);
        let slug = (0, slugify_1.generateSlug)(data.name);
        // Check if slug exists
        let existing = await prisma_1.default.category.findUnique({ where: { slug } });
        let count = 1;
        while (existing) {
            slug = `${(0, slugify_1.generateSlug)(data.name)}-${count}`;
            existing = await prisma_1.default.category.findUnique({ where: { slug } });
            count++;
        }
        if (data.parentId) {
            const parent = await prisma_1.default.category.findUnique({ where: { id: data.parentId } });
            if (!parent)
                return res.status(400).json({ error: 'Parent category not found' });
        }
        const category = await prisma_1.default.category.create({
            data: {
                ...data,
                slug
            }
        });
        return res.status(201).json(category);
    }
    catch (error) {
        if (error.name === 'ZodError')
            return res.status(400).json(error.errors);
        return res.status(500).json({ error: 'Failed to create category' });
    }
});
// PUT /categories/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = validation_1.CategoryUpdateSchema.parse(req.body);
        const target = await prisma_1.default.category.findUnique({ where: { id } });
        if (!target)
            return res.status(404).json({ error: 'Category not found' });
        // Prevent circular references basic check
        if (data.parentId && data.parentId === id) {
            return res.status(400).json({ error: 'Category cannot be its own parent' });
        }
        const category = await prisma_1.default.category.update({
            where: { id },
            data
        });
        return res.json(category);
    }
    catch (error) {
        if (error.name === 'ZodError')
            return res.status(400).json(error.errors);
        return res.status(500).json({ error: 'Failed to update category' });
    }
});
// PATCH /categories/:id/status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = validation_1.CategoryStatusSchema.parse(req.body);
        const category = await prisma_1.default.category.update({
            where: { id },
            data: { status }
        });
        return res.json(category);
    }
    catch (error) {
        if (error.name === 'ZodError')
            return res.status(400).json(error.errors);
        return res.status(500).json({ error: 'Failed to update category status' });
    }
});
// DELETE /categories/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const childrenCount = await prisma_1.default.category.count({ where: { parentId: id } });
        if (childrenCount > 0) {
            return res.status(400).json({ error: 'Cannot delete category with subcategories. Reassign or delete them first.' });
        }
        await prisma_1.default.category.delete({ where: { id } });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete category' });
    }
});
exports.default = router;
