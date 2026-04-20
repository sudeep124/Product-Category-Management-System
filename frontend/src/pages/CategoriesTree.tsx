import { useQuery } from '@tanstack/react-query'
import { categoriesApi, type CategoryNode } from '@/services/api'
import { ChevronRight, ChevronDown, Folder, Dot } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

function TreeNode({ node, level = 0 }: { node: CategoryNode; level?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="select-none text-sm">
      <div 
        className="flex items-center py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="w-5 h-5 flex flex-shrink-0 items-center justify-center mr-1 text-slate-500">
          {hasChildren ? (expanded ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>) : <Dot className="w-4 h-4 opacity-30"/>}
        </span>
        <span className="mr-2 text-primary flex-shrink-0" style={{ color: node.iconColor || "inherit" }}>
          <Folder className="w-4 h-4 fill-current opacity-20" />
        </span>
        <span className="flex-1 font-medium">{node.name}</span>
        {node.status === 'inactive' && (
          <Badge variant="outline" className="text-[10px] ml-2 font-normal text-muted-foreground bg-slate-50">Inactive</Badge>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoriesTree() {
  const { data: tree = [], isLoading } = useQuery({ queryKey: ['categories', 'tree'], queryFn: categoriesApi.getTree })

  if (isLoading) return <div>Loading tree hierarchy...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Category Hierarchy</h1>
      <div className="bg-card text-card-foreground p-6 border rounded-md shadow-sm max-w-3xl">
        {tree.length === 0 ? (
          <p className="text-muted-foreground text-sm">No categories defined yet.</p>
        ) : (
          tree.map(node => <TreeNode key={node.id} node={node} />)
        )}
      </div>
    </div>
  )
}
