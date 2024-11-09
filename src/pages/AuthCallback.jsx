import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const AuthCallback = () => {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const tokens = searchParams.get("tokens")
    const error = searchParams.get("error")

    if (tokens) {
      window.opener.postMessage(
        {
          type: "GOOGLE_AUTH_SUCCESS",
          tokens: JSON.parse(tokens),
        },
        "http://localhost:3000"
      )
    } else if (error) {
      window.opener.postMessage(
        {
          type: "GOOGLE_AUTH_ERROR",
          error,
        },
        "http://localhost:3000"
      )
    }

    // סגירת החלון
    setTimeout(() => window.close(), 1000)
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          {searchParams.get("tokens")
            ? "Authorization Successful!"
            : "Authorization Failed"}
        </h2>
        <p>This window will close automatically...</p>
      </div>
    </div>
  )
}

export default AuthCallback
