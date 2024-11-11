import { useState, useEffect, useRef } from "react"
import { Outlet, useLocation, Link } from "react-router-dom"
import { carAPI, maintenanceAPI } from "../../api"
import { toast } from "react-hot-toast"
import TopBar from "../dashboard/TopBar"
import {
  TruckIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  PlusIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline"
import FullScreenChat from "../ai/FullScreenChat"

const DashboardPage = () => {
  const [showDashboardContent, setShowDashboardContent] = useState(true)
  const [cars, setCars] = useState([])
  const [selectedCar, setSelectedCar] = useState(null)
  const [maintenanceInfo, setMaintenanceInfo] = useState([])
  const [showCarSelector, setShowCarSelector] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatResponse, setChatResponse] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const chatContainerRef = useRef(null)
  const location = useLocation()
  const [isFullScreenChat, setIsFullScreenChat] = useState(false)

  useEffect(() => {
    setShowDashboardContent(location.pathname === "/dashboard")
  }, [location])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carAPI.getAllCars()
        console.log("API Response:", response)

        const carsData = response.data.cars || response.data
        console.log("Cars Data:", carsData)

        setCars(carsData)

        if (carsData.length > 0 && !selectedCar) {
          const firstCar = carsData[0]
          setSelectedCar(firstCar)
          await fetchRecentMaintenance(firstCar._id)
        }
      } catch (error) {
        console.error("Failed to fetch cars:", error)
      }
    }

    fetchCars()
  }, [])

  const fetchRecentMaintenance = async (carId) => {
    try {
      console.log("Fetching maintenance for carId:", carId)
      const response = await maintenanceAPI.getMaintenanceRecords(carId)
      console.log("Maintenance API Response:", response)

      const records = response.data.records || response.data || []
      console.log("Maintenance Records:", records)

      if (Array.isArray(records) && records.length > 0) {
        const recentMaintenance = records
          .sort((a, b) => new Date(b.dateScheduled) - new Date(a.dateScheduled))
          .slice(0, 3)
          .map((record) => ({
            text: `${record.maintenanceType} - ${new Date(
              record.dateScheduled
            ).toLocaleDateString()}`,
            status:
              record.status ||
              (record.dateCompleted ? "completed" : "scheduled"),
            id: record._id,
          }))

        console.log("Processed maintenance info:", recentMaintenance)
        setMaintenanceInfo(recentMaintenance)
      } else {
        console.log("No maintenance records found in response")
        setMaintenanceInfo([])
      }
    } catch (error) {
      console.error("Failed to fetch maintenance records:", error)
      setMaintenanceInfo([])
    }
  }

  const handleCarChange = async (car) => {
    setSelectedCar(car)
    setShowCarSelector(false)
    await fetchRecentMaintenance(car._id)
  }

  const CarSelector = () => {
    console.log("Current cars state:", cars)

    return (
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 
        bg-black/90 rounded-xl border border-white/10 p-4 z-50"
      >
        {Array.isArray(cars) && cars.length > 0 ? (
          <div className="space-y-2">
            {cars.map((car) => (
              <button
                key={car._id}
                onClick={() => handleCarChange(car)}
                className={`w-full text-left px-4 py-2 rounded-lg 
                  hover:bg-white/10 transition-colors
                  ${
                    selectedCar?._id === car._id
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:text-white"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    {car.make} {car.model}
                  </span>
                  <span className="text-xs text-white/60">{car.year}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-white/60 text-center py-2">
            {Array.isArray(cars) ? "No cars found" : "Loading cars..."}
          </div>
        )}
      </div>
    )
  }

  const quickActions = [
    {
      title: "My Cars",
      description: "View and manage vehicles",
      icon: <TruckIcon className="w-8 h-8" />,
      link: "/dashboard/cars",
      color: "from-purple-500/20 to-purple-600/20",
      hoverColor: "hover:from-purple-500/30 hover:to-purple-600/30",
    },
    {
      title: "Maintenance History",
      description: "View all records",
      icon: <ClockIcon className="w-8 h-8" />,
      link: "/dashboard/maintenance/all",
      color: "from-orange-500/20 to-orange-600/20",
      hoverColor: "hover:from-orange-500/30 hover:to-orange-600/30",
    },
    {
      title: "Find Nearby Garages",
      description: "Search for garages",
      icon: <MapPinIcon className="w-8 h-8" />,
      link: "/dashboard/garages",
      color: "from-red-500/20 to-red-600/20",
      hoverColor: "hover:from-red-500/30 hover:to-red-600/30",
    },
  ]

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatMessage.trim() || !selectedCar || isChatLoading) return

    setIsChatLoading(true)
    const userQuestion = chatMessage
    setChatMessage("")

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: userQuestion,
        timestamp: new Date().toISOString(),
      },
    ])

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/autoagent/response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage: userQuestion,
            carId: selectedCar._id,
            make: selectedCar.make,
            model: selectedCar.model,
            year: selectedCar.year,
          }),
        }
      )

      const data = await response.json()

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: data.response,
            timestamp: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: "Sorry, I couldn't process your request at this time.",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsChatLoading(false)
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <TopBar />

      <div className="flex pt-16">
        <main className="flex-1 bg-[#0A0A0A]">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {showDashboardContent ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-5">
                      <div className="relative flex flex-col items-center mb-12">
                        <div
                          className="w-48 h-48 bg-gradient-to-br from-blue-500/10 to-blue-600/10 
                            rounded-full flex items-center justify-center relative border 
                            border-white/10 group cursor-pointer transform hover:scale-105 
                            transition-all duration-300 hover:from-blue-500/20 hover:to-blue-600/20
                            hover:shadow-xl hover:shadow-blue-500/10"
                          onClick={() => setShowCarSelector(!showCarSelector)}
                        >
                          <TruckIcon
                            className="h-24 w-24 text-blue-500 group-hover:text-blue-400 
                            transition-colors"
                          />
                          <div
                            className="absolute inset-0 border-4 border-blue-500/20 rounded-full 
                            border-t-blue-500 rotate-45 animate-spin-slow group-hover:border-t-blue-400"
                          />
                          <div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 
                            px-4 py-1.5 rounded-full text-sm text-white font-medium transform 
                            group-hover:scale-105 transition-all hover:bg-green-400"
                          >
                            {selectedCar
                              ? `${selectedCar.make} ${selectedCar.model}`
                              : "Select Car"}
                          </div>
                        </div>

                        <div className="flex mt-8">
                          <button
                            onClick={() => setShowCarSelector(!showCarSelector)}
                            className="flex items-center gap-2 px-4 py-2 
                              bg-white/5 rounded-xl border border-white/10 
                              hover:bg-white/10 transition-colors"
                          >
                            <ArrowPathIcon className="w-5 h-5 text-blue-500" />
                            <span className="text-white/80 text-sm">
                              Change Car
                            </span>
                          </button>
                        </div>

                        {showCarSelector && <CarSelector />}
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <Link to="/dashboard/maintenance/add">
                          <QuickAccessCard
                            icon={WrenchScrewdriverIcon}
                            text="Schedule Maintenance"
                            className="transform hover:scale-105 transition-all duration-200 
                              hover:shadow-lg hover:shadow-blue-500/10"
                          />
                        </Link>
                        <Link to="/dashboard/cars/add">
                          <QuickAccessCard
                            icon={PlusIcon}
                            text="Add New Car"
                            className="transform hover:scale-105 transition-all duration-200 
                              hover:shadow-lg hover:shadow-purple-500/10"
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="space-y-4 mb-8">
                        <h2 className="text-xl text-white font-light mb-4">
                          Maintenance Updates
                        </h2>
                        {maintenanceInfo && maintenanceInfo.length > 0 ? (
                          maintenanceInfo.map((info) => (
                            <div
                              key={info.id}
                              className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-5 
                                border border-white/10 hover:border-white/20 transition-all duration-200 
                                transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 bg-blue-500/10 rounded-full flex 
                                    items-center justify-center"
                                  >
                                    <WrenchScrewdriverIcon className="w-5 h-5 text-blue-500" />
                                  </div>
                                  <span className="text-white/80">
                                    {info.text}
                                  </span>
                                </div>
                                <span
                                  className={`text-xs px-3 py-1.5 rounded-full font-medium
                                  ${
                                    info.status === "completed"
                                      ? "bg-green-500/20 text-green-500"
                                      : "bg-blue-500/20 text-blue-500"
                                  }`}
                                >
                                  {info.status === "completed"
                                    ? "Completed"
                                    : "Scheduled"}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-white/60 text-center py-8 bg-white/5 rounded-xl border border-white/10">
                            {selectedCar
                              ? `No maintenance records found for ${selectedCar.make} ${selectedCar.model}`
                              : "Select a car to view maintenance records"}
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => setIsFullScreenChat(true)}
                        className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-8 
                          border border-white/10 hover:border-white/20 transition-all duration-300 
                          shadow-xl shadow-black/10"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 
                              rounded-full flex items-center justify-center"
                            >
                              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xl text-white font-medium">
                                AI Assistant
                              </div>
                              <div className="text-sm text-white/60">
                                Chat with your car assistant
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setIsFullScreenChat(true)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 
                              group flex items-center gap-2"
                          >
                            <span className="text-sm text-white/60 group-hover:text-white">
                              Expand
                            </span>
                            <ArrowsPointingOutIcon
                              className="w-5 h-5 text-white/60 
                              group-hover:text-white transform group-hover:scale-110 
                              transition-all duration-200"
                            />
                          </button>
                        </div>

                        <div
                          ref={chatContainerRef}
                          className="space-y-4 mb-6 max-h-[400px] overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                        >
                          {messages.map((message, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-xl ${
                                message.type === "user"
                                  ? "bg-blue-500/10 ml-12"
                                  : message.type === "assistant"
                                  ? "bg-white/5 mr-12"
                                  : "bg-red-500/10 mr-12"
                              }`}
                            >
                              <p className="text-sm text-white/80">
                                {message.content}
                              </p>
                            </div>
                          ))}
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleChatSubmit(e)
                          }}
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => {
                              e.stopPropagation()
                              setChatMessage(e.target.value)
                            }}
                            placeholder={
                              selectedCar
                                ? "Ask me anything about your car..."
                                : "Select a car to start chatting"
                            }
                            disabled={!selectedCar || isChatLoading}
                            className="w-full bg-white/5 rounded-xl p-4 pr-16 text-white/80 
                              text-sm placeholder-white/40 border border-white/10 
                              focus:outline-none focus:border-blue-500/50 transition-all
                              disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            type="submit"
                            disabled={
                              !selectedCar ||
                              !chatMessage.trim() ||
                              isChatLoading
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 
                              rounded-lg bg-blue-500/20 hover:bg-blue-500/30 
                              transition-all duration-200 disabled:opacity-50 
                              disabled:cursor-not-allowed"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isChatLoading ? (
                              <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />
                            ) : (
                              <PaperAirplaneIcon className="w-5 h-5 text-blue-500" />
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 border-t border-white/10 pt-12">
                    <h2 className="text-2xl text-white font-light mb-8">
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quickActions.map((action) => (
                        <Link
                          key={action.title}
                          to={action.link}
                          className={`bg-gradient-to-br ${action.color} ${action.hoverColor} 
                            rounded-xl p-6 border border-white/10 transition-all transform 
                            hover:scale-105 hover:shadow-xl hover:shadow-black/20 
                            hover:border-white/20 group`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-white group-hover:scale-110 transition-transform">
                              {action.icon}
                            </div>
                            <div>
                              <h3 className="text-lg text-white font-medium">
                                {action.title}
                              </h3>
                              <p
                                className="text-sm text-white/60 group-hover:text-white/80 
                                transition-colors"
                              >
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </main>
      </div>

      {isFullScreenChat && (
        <FullScreenChat
          messages={messages}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          handleChatSubmit={handleChatSubmit}
          isChatLoading={isChatLoading}
          selectedCar={selectedCar}
          setIsFullScreenChat={setIsFullScreenChat}
        />
      )}
    </div>
  )
}

const QuickAccessCard = ({ icon: Icon, text, className }) => {
  return (
    <div
      className={`bg-white/5 rounded-xl p-3 sm:p-4 cursor-pointer 
      hover:bg-white/10 transition-all duration-200 border border-white/10 
      hover:border-white/20 transform hover:scale-105 ${className}`}
    >
      <div className="text-center flex flex-col items-center">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500 mb-2" />
        <div className="text-xs sm:text-sm text-white/60">{text}</div>
      </div>
    </div>
  )
}

export default DashboardPage
