import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (code) {
      // שליחת הקוד לחלון ההורה
      window.opener?.postMessage(
        {
          type: "GOOGLE_AUTH_SUCCESS",
          code: code,
        },
        window.location.origin
      )
    } else if (error) {
      window.opener?.postMessage(
        {
          type: "GOOGLE_AUTH_ERROR",
          error: error,
        },
        window.location.origin
      )
    }

    // סגירת החלון אחרי שנייה
    setTimeout(() => window.close(), 1000)
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="animate-spin mb-4 mx-auto w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="text-white text-lg font-semibold">
          {searchParams.get("code")
            ? "Authorization successful!"
            : "Processing..."}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          This window will close automatically...
        </p>
      </div>
    </div>
  )
}

export default GoogleAuthCallback
