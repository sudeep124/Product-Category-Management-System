"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryStatusSchema = exports.CategoryUpdateSchema = exports.CategorySchema = void 0;
const zod_1 = require("zod");
exports.CategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(150),
    description: zod_1.z.string().optional().nullable(),
    parentId: zod_1.z.string().uuid().optional().nullable(),
    status: zod_1.z.enum(['active', 'inactive']).default('active'),
    sortOrder: zod_1.z.number().int().optional().default(0),
    iconColor: zod_1.z.string().max(7).optional().nullable()
});
exports.CategoryUpdateSchema = exports.CategorySchema.partial();
exports.CategoryStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['active', 'inactive'])
});
