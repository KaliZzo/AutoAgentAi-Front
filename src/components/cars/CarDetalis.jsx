import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { carAPI } from "../../api"
import { toast } from "react-hot-toast"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const CarDetails = () => {
  const { carId } = useParams()
  const [car, setCar] = useState(null)

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await carAPI.getOneCar(carId)
        setCar(response.data.car)
      } catch (error) {
        toast.error("Failed to fetch car details")
      }
    }
    fetchCarDetails()
  }, [carId])

  if (!car) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/dashboard/cars"
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back to Cars
      </Link>

      <div className="bg-white/5 rounded-xl p-8 border border-white/10">
        <h2 className="text-2xl text-white font-light mb-6">
          {car.make} {car.model}
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-white/60 mb-1">Make</label>
            <p className="text-white">{car.make}</p>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Model</label>
            <p className="text-white">{car.model}</p>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Year</label>
            <p className="text-white">{car.year}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails
