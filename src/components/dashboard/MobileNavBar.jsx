import { Link, useLocation } from "react-router-dom"
import {
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"

const MobileNavBar = () => {
  const location = useLocation()

  const menuItems = [
    {
      name: "Assistant",
      icon: ChatBubbleLeftRightIcon,
      path: "/dashboard",
    },
    {
      name: "Schedule",
      icon: CalendarIcon,
      path: "/dashboard/schedule",
    },
    {
      name: "Maintenance",
      icon: WrenchScrewdriverIcon,
      path: "/dashboard/maintenance",
    },
    {
      name: "Profile",
      icon: UserCircleIcon,
      path: "/dashboard/profile",
    },
  ]

  return (
    <div className="bg-zinc-950/80 backdrop-blur-lg border-t border-white/10">
      <div className="flex justify-around">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center py-3 px-5 
              ${
                location.pathname === item.path ? "text-white" : "text-gray-400"
              }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MobileNavBar
