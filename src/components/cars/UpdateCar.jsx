import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { carAPI } from "../../api"
import { toast } from "react-hot-toast"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const UpdateCar = () => {
  const { carId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [carData, setCarData] = useState({
    make: "",
    model: "",
    year: "",
  })

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true)
        const response = await carAPI.getOneCar(carId)
        const { make, model, year } = response.data.car
        setCarData({ make, model, year })
      } catch (error) {
        toast.error("Failed to fetch car details")
        navigate("/dashboard/cars")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCar()
  }, [carId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await carAPI.updateCar(carId, carData)
      toast.success("Car updated successfully")
      navigate("/dashboard/cars")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update car")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCarData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/dashboard/cars"
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
      >
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Cars
      </Link>

      <h2 className="text-2xl text-white font-light mb-8">
        Update Car Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Make */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Make</label>
          <input
            type="text"
            name="make"
            value={carData.make}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
            placeholder="e.g., Toyota"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Model</label>
          <input
            type="text"
            name="model"
            value={carData.model}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
            placeholder="e.g., Camry"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Year</label>
          <input
            type="number"
            name="year"
            value={carData.year}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            placeholder="e.g., 2023"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/cars")}
            className="flex-1 bg-white/5 text-white py-3 rounded-xl 
              hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 
              rounded-xl transition-colors"
          >
            Update Car
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateCar
