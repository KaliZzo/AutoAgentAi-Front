import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children }) => {
  // Add debugging
  console.log("Checking auth state...")
  console.log("LocalStorage user:", localStorage.getItem("user"))

  const userString = localStorage.getItem("user")

  if (!userString) {
    console.log("No user data found, redirecting to login")
    return <Navigate to="/login" />
  }

  try {
    const user = JSON.parse(userString)
    if (!user || !user.id) {
      console.log("Invalid user data, redirecting to login")
      return <Navigate to="/login" />
    }

    return children
  } catch (error) {
    console.error("Error parsing user data:", error)
    localStorage.removeItem("user") // Clear invalid data
    return <Navigate to="/login" />
  }
}

export default PrivateRoute
