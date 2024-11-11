// יצירת קומפוננטה חדשה
import { useRef, useEffect } from "react"
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline"

const FullScreenChat = ({
  messages,
  chatMessage,
  setChatMessage,
  handleChatSubmit,
  isChatLoading,
  selectedCar,
  setIsFullScreenChat,
}) => {
  const inputRef = useRef(null)

  // שמירה על פוקוס באינפוט
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50">
      <div className="absolute inset-0 overflow-hidden">
        {/* Header */}
        <div className="relative w-full max-w-6xl mx-auto pt-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 
                rounded-full flex items-center justify-center"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-white">AI Assistant</h2>
                <p className="text-sm text-white/60">
                  {selectedCar
                    ? `Chatting about your ${selectedCar.make} ${selectedCar.model} ${selectedCar.year}`
                    : "Select a car to start chatting"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFullScreenChat(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-white/60 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="h-[calc(100vh-180px)] w-full max-w-6xl mx-auto px-4">
          <div
            className="bg-gradient-to-br from-white/5 to-white/10 h-full 
            rounded-xl border border-white/10 overflow-hidden"
          >
            {/* Messages */}
            <div
              className="h-[calc(100%-80px)] overflow-y-auto p-6 space-y-6
              scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-3xl mx-auto ${
                    message.type === "user" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-4 rounded-xl ${
                      message.type === "user"
                        ? "bg-blue-500/10 ml-12"
                        : "bg-white/5 mr-12"
                    }`}
                  >
                    <p className="text-sm text-white/80">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="h-20 border-t border-white/10 p-4">
              <form
                onSubmit={handleChatSubmit}
                className="relative max-w-3xl mx-auto"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
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
                />
                <button
                  type="submit"
                  disabled={
                    !selectedCar || !chatMessage.trim() || isChatLoading
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 
                    rounded-lg bg-blue-500/20 hover:bg-blue-500/30 
                    transition-all duration-200 disabled:opacity-50 
                    disabled:cursor-not-allowed"
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
      </div>
    </div>
  )
}

export default FullScreenChat
