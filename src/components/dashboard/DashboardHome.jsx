import {
  PlusCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
} from "@heroicons/react/24/outline"

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      {/* Vehicle Icon Section */}
      <div className="flex justify-center">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 
            flex items-center justify-center border border-white/10"
          >
            <TruckIcon className="h-16 w-16 text-blue-500" />
          </div>
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 px-3 py-1 
            rounded-full text-xs text-white font-medium"
          >
            Active
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          title="Add Maintenance"
          description="Schedule new maintenance task"
          icon={PlusCircleIcon}
          onClick={() => console.log("Add Maintenance")}
          color="blue"
        />
        <QuickActionCard
          title="Track Maintenance"
          description="View maintenance history"
          icon={ClockIcon}
          onClick={() => console.log("Track Maintenance")}
          color="purple"
        />
        <QuickActionCard
          title="Ask Assistant"
          description="Get expert car advice"
          icon={ChatBubbleLeftRightIcon}
          onClick={() => console.log("Open Chat")}
          color="green"
        />
      </div>

      {/* Vehicle Status */}
      <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-medium text-white mb-4">Vehicle Status</h2>
        <div className="space-y-4">
          <StatusBar label="Oil Life" percentage={75} color="green" />
          <StatusBar label="Tire Health" percentage={90} color="blue" />
          <StatusBar label="Battery" percentage={60} color="yellow" />
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-medium text-white mb-4">
          Upcoming Maintenance
        </h2>
        <div className="space-y-3">
          <MaintenanceItem
            title="Oil Change"
            date="Mar 15, 2024"
            status="upcoming"
          />
          <MaintenanceItem
            title="Tire Rotation"
            date="Mar 28, 2024"
            status="scheduled"
          />
          <MaintenanceItem
            title="Brake Inspection"
            date="Apr 5, 2024"
            status="pending"
          />
        </div>
      </div>
    </div>
  )
}

// Quick Action Card Component
const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  color,
}) => {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/10 text-blue-500",
    purple: "from-purple-500/10 to-purple-600/10 text-purple-500",
    green: "from-green-500/10 to-green-600/10 text-green-500",
  }

  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} 
        border border-white/10 text-left transition-all duration-200 
        hover:scale-[1.02] hover:border-white/20`}
    >
      <Icon className="h-8 w-8 mb-3" />
      <h3 className="text-white font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  )
}

// Status Bar Component
const StatusBar = ({ label, percentage, color }) => {
  const colorClasses = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
  }

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{percentage}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Maintenance Item Component
const MaintenanceItem = ({ title, date, status }) => {
  const statusClasses = {
    upcoming: "bg-yellow-500/10 text-yellow-500",
    scheduled: "bg-blue-500/10 text-blue-500",
    pending: "bg-purple-500/10 text-purple-500",
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status}
      </span>
    </div>
  )
}

export default DashboardHome
