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
  getAllMaintenanceRecords: () =>
    api.get("/maintenance/getAllMaintenanceRecords"),
  getMaintenanceRecords: (carId) =>
    api.get(`/maintenance/getMaintenanceRecords/${carId}`),
  addMaintenance: (maintenanceData) =>
    api.post("/maintenance/addMaintenance", maintenanceData),
  updateMaintenance: (maintenanceId, maintenanceData) =>
    api.put(`/maintenance/updateMaintenance/${maintenanceId}`, maintenanceData),
  deleteMaintenance: (maintenanceId) =>
    api.delete(`/maintenance/deleteMaintenance/${maintenanceId}`),
  getGoogleAuthUrl: async () => {
    const token = localStorage.getItem("token")
    const response = await api.get("/calendar/auth", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.url
  },
  addToCalendar: async (maintenance) => {
    const token = localStorage.getItem("token")

    try {
      // 1. קבלת URL הרשאה
      const authUrl = await maintenanceAPI.getGoogleAuthUrl()

      // 2. פתיחת חלון אותנטיקציה
      const authWindow = window.open(
        authUrl,
        "Google Calendar Authorization",
        "width=600,height=600"
      )

      return new Promise((resolve, reject) => {
        const handleMessage = async (messageEvent) => {
          if (messageEvent.origin !== window.location.origin) return

          if (
            messageEvent.data.type === "GOOGLE_AUTH_SUCCESS" &&
            messageEvent.data.code
          ) {
            window.removeEventListener("message", handleMessage)

            try {
              // 3. קבלת טוקנים מהקוד
              const tokensResponse = await api.get(
                `/calendar/auth/callback?code=${messageEvent.data.code}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )

              // 4. יצירת אובייקט האירוע
              const calendarEvent = {
                summary: `Car Maintenance: ${maintenance.maintenanceType}`,
                description: maintenance.notes || "Scheduled Maintenance",
                start: {
                  dateTime: new Date(maintenance.dateScheduled).toISOString(),
                  timeZone: "Asia/Jerusalem",
                },
                end: {
                  dateTime: new Date(
                    new Date(maintenance.dateScheduled).getTime() +
                      60 * 60 * 1000
                  ).toISOString(),
                  timeZone: "Asia/Jerusalem",
                },
                tokens: tokensResponse.data,
              }

              // הוספת לוגים לדיבוג
              console.log("Calendar Event:", calendarEvent)

              // 5. הוספת האירוע
              const response = await api.post(
                "/calendar/add-event",
                calendarEvent,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )

              if (authWindow) {
                try {
                  authWindow.close()
                } catch (windowError) {
                  console.warn("Could not close auth window")
                }
              }

              resolve(response.data)
            } catch (err) {
              if (authWindow) {
                try {
                  authWindow.close()
                } catch (windowError) {
                  console.warn("Could not close auth window")
                }
              }
              reject(err)
            }
          }
        }

        window.addEventListener("message", handleMessage)
      })
    } catch (error) {
      throw error
    }
  },
  getMaintenanceById: (maintenanceId) =>
    api.get(`/maintenance/getMaintenance/${maintenanceId}`),
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
