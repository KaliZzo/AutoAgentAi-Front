import { Link, useLocation } from "react-router-dom"
import {
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"

const Sidebar = ({ isOpen }) => {
  const location = useLocation()

  const menuItems = [
    {
      name: "AI Assistant",
      icon: ChatBubbleLeftRightIcon,
      path: "/dashboard",
      description: "Get expert car advice",
    },
    {
      name: "Service Schedule",
      icon: CalendarIcon,
      path: "/dashboard/schedule",
      description: "Manage maintenance calendar",
    },
    {
      name: "Maintenance",
      icon: WrenchScrewdriverIcon,
      path: "/dashboard/maintenance",
      description: "Track car maintenance",
    },
    {
      name: "Profile",
      icon: UserCircleIcon,
      path: "/dashboard/profile",
      description: "Manage your account",
    },
  ]

  return (
    <div
      className={`h-screen bg-zinc-950 ${isOpen ? "w-64" : "w-20"} 
      transition-all duration-300 border-r border-zinc-800 fixed`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center">
        <span className="text-white text-xl font-medium">AutoAgent</span>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-3 mb-2 rounded-xl
              transition-all duration-200 group
              ${
                location.pathname === item.path
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
          >
            <item.icon className="h-6 w-6 flex-shrink-0" />
            {isOpen && (
              <div className="ml-3">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
