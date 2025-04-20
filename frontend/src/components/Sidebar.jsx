
import { Home, Users, ImageIcon, Upload, Grid, X } from "lucide-react"
import { Link } from "react-router-dom"


export function Sidebar({ isOpen, toggleSidebar, userRole }) {
  // Define navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
          { id: "my-uploads", label: "My Uploads", icon: Users, href: "/my-uploads" },
          { id: "settings", label: "Settings", icon: Users, href: "/settings" },
        ]
      case "uploader":
        return [
          { id: "my-uploads", label: "My Uploads", icon: Users, href: "/my-uploads" },
          { id: "gallery", label: "View Gallery", icon: Grid, href: "/gallery" },
          { id: "settings", label: "Settings", icon: Users, href: "/settings" },
        ]
      case "viewer":
      default:
        return [
          { id: "dashboard", label: "Dashboard", icon: Grid, href: "/" },
          { id: "settings", label: "Settings", icon: Users, href: "/settings" },
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
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className="px-4 py-3">
            <div className="text-sm text-gray-400">Logged in as</div>
            <div className="font-medium capitalize">{userRole}</div>
          </div>
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700 lg:hidden">
            <X size={20} />
          </button>
        </div>

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
      </aside>
    </>
  )
}
