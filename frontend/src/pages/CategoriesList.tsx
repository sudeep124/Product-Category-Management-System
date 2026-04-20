import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@/services/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryForm } from "@/components/CategoryForm"
import { useState } from 'react'

export default function CategoriesList() {
  const { data: categories = [], isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoriesApi.getAll })
  const queryClient = useQueryClient()
  
  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  })

  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [open, setOpen] = useState(false)

  if (isLoading) return <div>Loading categories...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button onClick={() => { setEditingCategory(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2"/> Add Category</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
            </DialogHeader>
            <CategoryForm initialData={editingCategory} categories={categories} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium flex items-center">
                   {c.iconColor && <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: c.iconColor }}></span>}
                   {c.name}
                </TableCell>
                <TableCell>{c.slug}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === 'active' ? 'bg-success/20 text-success' : 'bg-gray-100 text-gray-800'}`}>
                    {c.status}
                  </span>
                </TableCell>
                <TableCell>{categories.find(p => p.id === c.parentId)?.name || '-'}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => { setEditingCategory(c); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => {
                     if (confirm("Are you sure?")) {
                       deleteMutation.mutate(c.id)
                     }
                  }}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No categories found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
