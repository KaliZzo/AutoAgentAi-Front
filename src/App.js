import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"
import LoginPage from "./components/pages/LoginPage"
import SignupPage from "./components/pages/SignUp"
import TwoFactorAuthPage from "./components/pages/TwoFactorAuthPage"
import DashboardPage from "./components/dashboard/DashboardPage"
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage"
import ResetPasswordPage from "./components/pages/ResetPasswordPage"

// Import Car Components
import CarList from "./components/cars/CarList"
import AddCar from "./components/cars/AddCar"
import UpdateCar from "./components/cars/UpdateCar"
import CarDetails from "./components/cars/CarDetalis"

// Import Maintenance Components
import MaintenanceList from "./components/maintenance/MaintenanceList"
import AddMaintenance from "./components/maintenance/AddMaintenance"
import UpdateMaintenance from "./components/maintenance/UpdateMaintenance"

// Import Google Auth Callback Component
import GoogleAuthCallback from "./components/maintenance/GoogleAuthCallback"

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/2fa" element={<TwoFactorAuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          {/* Cars Routes */}
          <Route path="cars" element={<CarList />} />
          <Route path="cars/add" element={<AddCar />} />
          <Route path="cars/update/:carId" element={<UpdateCar />} />
          <Route path="cars/:carId" element={<CarDetails />} />

          {/* Maintenance Routes */}
          <Route path="maintenance/add" element={<AddMaintenance />} />
          <Route path="maintenance/:carId" element={<MaintenanceList />} />
          <Route
            path="maintenance/update/:maintenanceId"
            element={<UpdateMaintenance />}
          />
        </Route>

        {/* Google Auth Callback Route - עדכון הנתיב להתאמה מדויקת */}
        <Route
          path="/api/v1/calendar/auth/callback"
          element={<GoogleAuthCallback />}
        />
      </Routes>
    </Router>
  )
}

export default App
