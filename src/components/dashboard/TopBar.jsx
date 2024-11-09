import {
  Bars3Icon,
  BellIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline"

const TopBar = ({ onMenuClick }) => {
  return (
    <div
      className="h-16 bg-black/50 backdrop-blur-xl border-b border-white/10 
      sticky top-0 z-10"
    >
      <div className="h-full px-4 flex items-center justify-between max-w-6xl mx-auto">
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
