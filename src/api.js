import axios from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  signup: (userData) => api.post("/signup", userData),
  request2FA: (userId) => api.post("/request-2fa", { userId }),
  verify2FA: (data) => api.post("/verify-2fa", data),
  forgotPassword: (email) => api.post("/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.put(`/reset-password/${token}`, { password }),
}

// Car API calls
export const carAPI = {
  addCar: (carData) => api.post("/car/addCar", carData),
  updateCar: (carId, carData) => api.put(`/car/updateCar/${carId}`, carData),
  deleteCar: (carId) => api.delete(`/car/deleteCar/${carId}`),
  getAllCars: () => api.get("/car/getAllCars"),
  getOneCar: (carId) => api.get(`/car/getOneCar/${carId}`),
}

// Maintenance API calls
export const maintenanceAPI = {
  addMaintenance: (maintenanceData) =>
    api.post("/maintenance/addMaintenance", maintenanceData),
  getMaintenanceRecords: (carId) =>
    api.get(`/maintenance/getMaintenanceRecords/${carId}`),
  updateMaintenance: (maintenanceId, data) =>
    api.put(`/maintenance/updateMaintenance/${maintenanceId}`, data),
  deleteMaintenance: (maintenanceId) =>
    api.delete(`/maintenance/deleteMaintenance/${maintenanceId}`),
  addToCalendar: (maintenanceId) =>
    api.post(`/maintenance/${maintenanceId}/add-to-calendar`),
}

// Google Calendar API calls
export const googleCalendarAPI = {
  getAuthURL: () => api.get("/google-calendar/auth"),
  getTokens: (code) => api.get(`/google-calendar/auth/callback?code=${code}`),
  addEvent: (eventData) => api.post("/google-calendar/add-event", eventData),
}

// Google Maps API calls
export const googleMapsAPI = {
  findNearbyGarages: (params) => api.get("/google-maps/garages", { params }),
}

// OpenAI API calls
export const openAIAPI = {
  getResponse: (data) => api.post("/openai/response", data),
}

export default api
