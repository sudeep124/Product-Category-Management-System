import { Link } from "react-router-dom"
import { LayoutDashboard, ListTree, PackagePlus } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-primary text-primary-foreground min-h-screen p-4 flex flex-col hidden md:flex">
      <div className="font-bold text-xl mb-8 flex items-center space-x-2">
        <ListTree className="w-6 h-6" />
        <span>SPCS Admin</span>
      </div>
      <nav className="space-y-2">
        <Link to="/" className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link to="/categories" className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors">
          <ListTree className="w-5 h-5" />
          <span>Categories List</span>
        </Link>
        <Link to="/categories/tree" className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors">
          <ListTree className="w-5 h-5 opacity-70" />
          <span>Hierarchy Tree</span>
        </Link>
        <Link to="/products/new" className="flex items-center space-x-2 p-2 rounded hover:bg-white/10 transition-colors">
          <PackagePlus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </nav>
    </aside>
  )
}
