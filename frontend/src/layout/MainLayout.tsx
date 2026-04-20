import { Outlet } from "react-router-dom"
import TopNav from "./TopNav"
import Sidebar from "./Sidebar"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex text-foreground bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
