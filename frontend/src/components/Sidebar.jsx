import { Home, Grid, X, LogOut, Settings, UploadCloud, Image, Star } from "lucide-react"
import { Link } from "react-router-dom"


export function Sidebar({ isOpen, toggleSidebar }) {
  const userRole = localStorage.getItem("userRole") || "USER" // Default to viewer if not set

  const getNavItems = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
          { id: "my-uploads", label: "My Uploads", icon: UploadCloud, href: "/my-uploads" },
          { id: "favorites", label: "Favorites", icon: Star, href: "/favorites" },
          { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
        ]
      case "USER":
      default:
        return [
          { id: "dashboard", label: "Dashboard", icon: Grid, href: "/" },
          { id: "my-uploads", label: "My Uploads", icon: UploadCloud, href: "/my-uploads" },
          { id: "favorites", label: "Favorites", icon: Star, href: "/favorites" },
          { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
        ]
    }
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`h-full fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >

        <div className="flex flex-col justify-between h-full px-4 border-b border-gray-700">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 bg-gray-800  border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
                </div>
                {/* <div className="font-bold text-lg">Pixel</div> */}
              </div>
              <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700 lg:hidden">
                <X size={20} />
              </button>
            </div>
            {/* <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
              <div className="px-4 py-3">
                <div className="text-sm text-gray-400">Logged in as</div>
                <div className="font-medium capitalize">{userRole}</div>
              </div>
              <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700 lg:hidden">
                <X size={20} />
              </button>
            </div> */}

            <nav className="mt-6">
              <ul className="space-y-2 px-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors `}
                      >
                        {/* ${currentPage === item.id
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } */}
                        <Icon size={20} className="mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
          <div className="flex items-center justify-between h-16 px-4 border-t border-gray-700">
            <button
              onClick={() => {
                localStorage.clear()
                window.location.href = "/signin"
              }}
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
