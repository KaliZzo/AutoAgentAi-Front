import { useState } from "react"
import { carAPI } from "../../api"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const AddCar = () => {
  const navigate = useNavigate()
  const [carData, setCarData] = useState({
    make: "",
    model: "",
    year: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await carAPI.addCar(carData)
      toast.success("Car added successfully")
      navigate("/dashboard/cars")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add car")
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl text-white font-light mb-8">Add New Car</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">Make</label>
          <input
            type="text"
            value={carData.make}
            onChange={(e) => setCarData({ ...carData, make: e.target.value })}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Model</label>
          <input
            type="text"
            value={carData.model}
            onChange={(e) => setCarData({ ...carData, model: e.target.value })}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Year</label>
          <input
            type="number"
            value={carData.year}
            onChange={(e) => setCarData({ ...carData, year: e.target.value })}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 
            rounded-xl transition-colors"
        >
          Add Car
        </button>
      </form>
    </div>
  )
}

export default AddCar
