import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi, type Category } from '@/services/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  description: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  sortOrder: z.number().int().optional(),
  iconColor: z.string().optional()
})

interface Props {
  initialData?: Category;
  categories: Category[];
  onSuccess: () => void;
}

export function CategoryForm({ initialData, categories, onSuccess }: Props) {
  const isEdit = !!initialData
  const queryClient = useQueryClient()

  const { register, handleSubmit, control, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      parentId: (initialData?.parentId) || 'none',
      status: initialData?.status || 'active',
      sortOrder: initialData?.sortOrder || 0,
      iconColor: initialData?.iconColor || ''
    }
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      const payload = {
        ...values,
        parentId: values.parentId === 'none' ? undefined : values.parentId,
      }
      return isEdit ? categoriesApi.update({ id: initialData!.id, ...payload }) : categoriesApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onSuccess()
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Electronics" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="parentId">Parent Category</Label>
        <Controller
          name="parentId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select a parent" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Root Category)</SelectItem>
                {categories.filter(c => c.id !== initialData?.id).map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.parentId && <p className="text-sm text-red-500">{errors.parentId.message}</p>}
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="status">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>
        <div className="space-y-2 flex-1">
          <Label htmlFor="iconColor">Icon Color (Hex)</Label>
          <Input id="iconColor" type="color" className="h-10 px-2 py-1 w-full" {...register('iconColor')} />
          {errors.iconColor && <p className="text-sm text-red-500">{errors.iconColor.message}</p>}
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
      </Button>
    </form>
  )
}
