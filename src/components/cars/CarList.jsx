import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { carAPI } from "../../api"
import { toast } from "react-hot-toast"
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline"

const CarList = () => {
  const [cars, setCars] = useState([])

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const response = await carAPI.getAllCars()
      setCars(response.data.cars)
    } catch (error) {
      toast.error("Failed to fetch cars")
    }
  }

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await carAPI.deleteCar(carId)
        toast.success("Car deleted successfully")
        fetchCars()
      } catch (error) {
        toast.error("Failed to delete car")
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
      >
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl text-white font-light">My Cars</h2>
        <Link
          to="/dashboard/cars/add"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 
            text-white px-4 py-2 rounded-xl transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Car
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-white/5 rounded-xl p-6 border border-white/10 
              hover:border-white/20 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg text-white font-medium">
                  {car.make} {car.model}
                </h3>
                <p className="text-white/60">{car.year}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/cars/update/${car._id}`}
                  className="p-2 rounded-xl text-gray-400 hover:bg-white/5 
                    hover:text-white transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-white/5 
                    hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <Link
              to={`/dashboard/cars/${car._id}`}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarList
