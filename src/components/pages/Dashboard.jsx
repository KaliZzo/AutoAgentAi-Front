import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api"

const Dashboard = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  const handleLogout = async () => {
    try {
      await api.post("/logout")
      localStorage.removeItem("user")
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl mb-4">Dashboard Content</h2>
          <p>You've successfully logged in with 2FA!</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
