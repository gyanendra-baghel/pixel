import { LogOut, Menu } from "lucide-react"

export function Header({ toggleSidebar, sidebarOpen, onLogout }) {
  return (
    <header className="bg-gray-900 text-white h-16 flex items-center justify-between px-4 shadow-md z-10 lg:hidden">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-1 mr-4 rounded-md hover:bg-gray-700 lg:hidden">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">Vision Ai</h1>
      </div>

      <div className="flex items-center">
        <button
          onClick={onLogout}
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}
