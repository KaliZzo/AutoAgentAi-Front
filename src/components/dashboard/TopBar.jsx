import {
  Bars3Icon,
  BellIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../../api"
import { toast } from "react-hot-toast"

const TopBar = ({ onMenuClick }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authAPI.logout()

      // Clear any local storage items
      localStorage.removeItem("user")
      localStorage.removeItem("token")

      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Failed to logout. Please try again.")
    }
  }

  return (
    <div
      className="h-16 bg-black/50 backdrop-blur-xl border-b border-white/10 
      sticky top-0 z-10"
    >
      <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-400 
              hover:bg-white/5 hover:text-white transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Calendar Integration */}
          <button
            className="p-2 rounded-xl text-gray-400 hover:bg-white/5 
            hover:text-white transition-colors"
          >
            <CalendarDaysIcon className="h-6 w-6" />
          </button>

          {/* Notifications */}
          <button
            className="p-2 rounded-xl text-gray-400 hover:bg-white/5 
            hover:text-white transition-colors"
          >
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-gray-400 hover:bg-white/5 
              hover:text-white transition-colors group"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon
              className="h-6 w-6 group-hover:text-red-500 
              transition-colors"
            />
          </button>

          {/* Profile */}
          <div
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-400 
            to-blue-600 flex items-center justify-center"
          >
            <span className="text-sm font-medium text-white">AA</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
