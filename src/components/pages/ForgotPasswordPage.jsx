import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../../api"

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await authAPI.forgotPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset error:", error)
      setError(
        error.response?.data?.message ||
          "Failed to send reset instructions. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-2xl">
        {/* Logo */}
        <div className="flex justify-center">
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"
            />
          </svg>
        </div>

        {/* Header Text */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Reset Password
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!isSubmitted ? (
          /* Reset Password Form */
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                placeholder="Email address"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
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
                    Sending...
                  </span>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Message */
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-white text-lg font-medium">Check your email</h3>
            <p className="text-gray-400 text-sm">
              We've sent password reset instructions to {email}
            </p>
          </div>
        )}

        {/* Back to Login Link */}
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

export default ForgotPasswordPage
