import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authAPI } from "../../api"

const TwoFactorAuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(120) // 2 minutes countdown
  const [resending, setResending] = useState(false)

  const userData = location.state?.userData

  useEffect(() => {
    if (!userData) {
      navigate("/login")
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [userData, navigate])

  const handleResendCode = async () => {
    setResending(true)
    setError("")

    try {
      await authAPI.request2FA()
      setCountdown(120) // Reset countdown
    } catch (error) {
      setError("Failed to resend code")
    } finally {
      setResending(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("Submitting 2FA with:", {
      userId: userData?.userId,
      code: verificationCode,
    })

    if (!userData?.userId) {
      setError("User data is missing")
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.verify2FA({
        userId: userData.userId,
        code: verificationCode,
      })

      console.log("2FA verification response:", response.data)

      // Store user data and redirect
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard", { replace: true })
    } catch (error) {
      console.error("Verification error:", error)
      setError(error.response?.data?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^\d]/g, "")
    setVerificationCode(value)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-2xl">
        {/* Logo - החלפת ה-SVG בטקסט */}
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            AutoAgent
          </h1>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Please enter the verification code sent to {userData?.email}
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              value={verificationCode}
              onChange={handleCodeChange}
              maxLength="4"
              required
              className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-center text-2xl tracking-widest"
              placeholder="0000"
              disabled={loading}
            />
          </div>

          {/* Timer and Resend */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Time remaining: {Math.floor(countdown / 60)}:
              {(countdown % 60).toString().padStart(2, "0")}
            </p>
            {countdown === 0 && (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="mt-2 text-sm text-white hover:underline"
              >
                {resending ? "Resending..." : "Resend Code"}
              </button>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 4}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all ${
                loading || verificationCode.length !== 4
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-300 hover:text-white transition-colors"
            disabled={loading}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorAuthPage
