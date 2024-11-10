const handleLogin = async (values) => {
  try {
    const response = await fetch("http://localhost:5000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const data = await response.json()

    if (response.ok) {
      console.log("Login response:", data) // נבדוק את התגובה המלאה
      console.log("Setting token:", data.token) // נבדוק את ה-token

      localStorage.setItem("token", data.token)

      // נבדוק מיד אחרי השמירה
      console.log("Token saved in localStorage:", localStorage.getItem("token"))

      navigate("/dashboard")
    } else {
      toast.error(data.message || "Login failed")
    }
  } catch (error) {
    console.error("Login error:", error)
    toast.error("Failed to login")
  }
}
