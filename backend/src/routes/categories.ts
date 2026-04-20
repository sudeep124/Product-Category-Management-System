import { Router, Request, Response } from 'express'
import prisma from '../prisma'
import { CategorySchema, CategoryUpdateSchema, CategoryStatusSchema } from '../utils/validation'
import { generateSlug } from '../utils/slugify'

const router = Router()

// GET /categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET /categories/tree
router.get('/tree', async (req, res) => {
  try {
    const categories = await prisma.category.findMany()
    const categoryMap = new Map()
    categories.forEach(cat => categoryMap.set(cat.id, { ...cat, children: [] }))
    
    const tree: any[] = []
    categoryMap.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId)
        if (parent) {
          parent.children.push(cat)
          parent.children.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        }
      } else {
        tree.push(cat)
      }
    })
    tree.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
    res.json(tree)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category tree' })
  }
})

// POST /categories
router.post('/', async (req, res): Promise<any> => {
  try {
    const data = CategorySchema.parse(req.body)
    
    let slug = generateSlug(data.name)
    // Check if slug exists
    let existing = await prisma.category.findUnique({ where: { slug } })
    let count = 1
    while (existing) {
      slug = `${generateSlug(data.name)}-${count}`
      existing = await prisma.category.findUnique({ where: { slug } })
      count++
    }

    if (data.parentId) {
      const parent = await prisma.category.findUnique({ where: { id: data.parentId } })
      if (!parent) return res.status(400).json({ error: 'Parent category not found' })
    }

    const category = await prisma.category.create({
      data: {
        ...data,
        slug
      }
    })
    
    return res.status(201).json(category)
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors)
    return res.status(500).json({ error: 'Failed to create category' })
  }
})

// PUT /categories/:id
router.put('/:id', async (req, res): Promise<any> => {
  try {
    const { id } = req.params
    const data = CategoryUpdateSchema.parse(req.body)
    
    const target = await prisma.category.findUnique({ where: { id } })
    if (!target) return res.status(404).json({ error: 'Category not found' })

    // Prevent circular references basic check
    if (data.parentId && data.parentId === id) {
      return res.status(400).json({ error: 'Category cannot be its own parent' })
    }

    const category = await prisma.category.update({
      where: { id },
      data
    })
    
    return res.json(category)
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors)
    return res.status(500).json({ error: 'Failed to update category' })
  }
})

// PATCH /categories/:id/status
router.patch('/:id/status', async (req, res): Promise<any> => {
  try {
    const { id } = req.params
    const { status } = CategoryStatusSchema.parse(req.body)
    
    const category = await prisma.category.update({
      where: { id },
      data: { status }
    })
    
    return res.json(category)
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json(error.errors)
    return res.status(500).json({ error: 'Failed to update category status' })
  }
})

// DELETE /categories/:id
router.delete('/:id', async (req, res): Promise<any> => {
  try {
    const { id } = req.params
    
    const childrenCount = await prisma.category.count({ where: { parentId: id } })
    if (childrenCount > 0) {
      return res.status(400).json({ error: 'Cannot delete category with subcategories. Reassign or delete them first.' })
    }

    await prisma.category.delete({ where: { id } })
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete category' })
  }
})

export default router
