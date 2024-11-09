import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "../dashboard/Sidebar"
import TopBar from "../dashboard/TopBar"
import MobileNavBar from "../dashboard/MobileNavBar"
import {
  TruckIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showDashboardContent, setShowDashboardContent] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setShowDashboardContent(location.pathname === "/dashboard")
  }, [location])

  const maintenanceInfo = [
    { text: "Next Maintenance at 30/12" },
    { text: "Oil Change Due in 500km" },
    { text: "Tire Rotation in 2 weeks" },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {showDashboardContent ? (
              <div className="max-w-7xl mx-auto px-6 py-8 mb-16 lg:mb-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column */}
                  <div className="lg:col-span-5">
                    {/* Vehicle Icon and Actions */}
                    <div className="relative flex flex-col items-center mb-8">
                      <div
                        className="w-48 h-48 bg-gradient-to-br 
                        from-blue-500/10 to-blue-600/10 rounded-full 
                        flex items-center justify-center relative border border-white/10
                        transform hover:scale-105 transition-transform duration-200"
                      >
                        <TruckIcon className="h-24 w-24 text-blue-500" />
                        <div
                          className="absolute inset-0 border-4 border-blue-500/20 
                          rounded-full border-t-blue-500 rotate-45 animate-spin-slow"
                        ></div>
                        <div
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                          bg-green-500 px-3 py-1 rounded-full text-xs text-white font-medium"
                        >
                          Active
                        </div>
                      </div>

                      {/* Car Actions */}
                      <div className="flex gap-4 mt-8">
                        <button
                          className="flex items-center gap-2 px-4 py-2 
                          bg-white/5 rounded-xl border border-white/10 
                          hover:bg-white/10 transition-colors"
                        >
                          <ArrowPathIcon className="w-5 h-5 text-blue-500" />
                          <span className="text-white/80 text-sm">
                            Change Car
                          </span>
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 
                          bg-white/5 rounded-xl border border-white/10 
                          hover:bg-white/10 transition-colors"
                        >
                          <PlusIcon className="w-5 h-5 text-blue-500" />
                          <span className="text-white/80 text-sm">Add Car</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Access Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <QuickAccessCard
                        icon={WrenchScrewdriverIcon}
                        text="Add Maintenance"
                      />
                      <QuickAccessCard
                        icon={ClockIcon}
                        text="Track Maintenance"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-7">
                    {/* Maintenance Info */}
                    <div className="space-y-4 mb-8">
                      <h2 className="text-xl text-white font-light mb-4">
                        Maintenance Updates
                      </h2>
                      {maintenanceInfo.map((info, i) => (
                        <div
                          key={i}
                          className="bg-white/5 rounded-xl p-5 border border-white/10 
                          hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <div className="text-sm text-white/80">
                            {info.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Chat Box */}
                    <div
                      className="bg-white/5 rounded-xl p-8 border border-white/10 
                      hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-16 h-16 bg-blue-500/10 rounded-full 
                          flex items-center justify-center"
                        >
                          <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="text-lg text-white font-medium">
                            AI Assistant
                          </div>
                          <div className="text-sm text-white/60">
                            How can I help you with your car?
                          </div>
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Ask me anything about your car..."
                          className="w-full bg-white/5 rounded-xl p-5 text-white/80 
                            text-sm placeholder-white/40 border border-white/10 
                            focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNavBar />
      </div>
    </div>
  )
}

// Quick Access Card Component
const QuickAccessCard = ({ icon: Icon, text }) => {
  return (
    <div
      className="bg-white/5 rounded-xl p-3 sm:p-4 cursor-pointer 
      hover:bg-white/10 transition-all duration-200 border border-white/10 
      hover:border-white/20 transform hover:scale-105"
    >
      <div className="text-center flex flex-col items-center">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500 mb-2" />
        <div className="text-xs sm:text-sm text-white/60">{text}</div>
      </div>
    </div>
  )
}

export default DashboardPage
