import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"
import LoginPage from "./components/pages/LoginPage"
import SignupPage from "./components/pages/SignUp"
import TwoFactorAuthPage from "./components/pages/TwoFactorAuthPage"
import DashboardPage from "./components/dashboard/DashboardPage"
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage"
import ResetPasswordPage from "./components/pages/ResetPasswordPage"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/2fa" element={<TwoFactorAuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/*" // Add the /* to handle nested routes
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
