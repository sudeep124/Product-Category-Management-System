import { Bell, UserCircle, LogOut } from "lucide-react"
import { useAuth } from "../store/AuthContext"
import { useNavigate } from "react-router-dom"

export default function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <div className="font-semibold text-lg flex md:hidden items-center">
        SPCS
      </div>
      <div className="hidden md:block">
        <h2 className="font-semibold text-lg">Product Category Management</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full cursor-pointer">
          <UserCircle className="w-6 h-6 text-slate-500" />
          <span className="text-sm font-medium hidden sm:block">{user?.name || "Admin"}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
