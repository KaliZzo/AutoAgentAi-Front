import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { maintenanceAPI, carAPI } from "../../api"
import { toast } from "react-hot-toast"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const AddMaintenance = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [maintenanceRecords, setMaintenanceRecords] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    carId: "",
    maintenanceType: "",
    dateScheduled: "",
    dateCompleted: "",
    cost: "",
    notes: "",
  })

  // Fetch cars and maintenance records when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cars
        const carsResponse = await carAPI.getAllCars()
        setCars(carsResponse.data.cars)

        // Fetch all maintenance records
        const maintenanceResponse =
          await maintenanceAPI.getAllMaintenanceRecords()
        setMaintenanceRecords(maintenanceResponse.data.records)
      } catch (error) {
        toast.error("Failed to fetch data")
      }
    }
    fetchData()
  }, [])

  // Filter out cars that already have maintenance scheduled
  const availableCars = cars.filter((car) => {
    const hasMaintenanceScheduled = maintenanceRecords.some(
      (record) => record.carId === car._id && !record.dateCompleted
    )
    return !hasMaintenanceScheduled
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.carId) {
      toast.error("Please select a car")
      return
    }
    if (!formData.dateScheduled) {
      toast.error("Please select a scheduled date")
      return
    }

    setIsLoading(true)
    try {
      const maintenanceData = {
        ...formData,
        cost: formData.cost ? Number(formData.cost) : 0, // Convert to number
      }

      console.log("Submitting maintenance data:", maintenanceData) // Debug log
      await maintenanceAPI.addMaintenance(maintenanceData)
      toast.success("Maintenance record added successfully")
      navigate(`/dashboard/maintenance/${formData.carId}`)
    } catch (error) {
      console.error("Error details:", error.response?.data)
      toast.error(
        error.response?.data?.message || "Failed to add maintenance record"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/dashboard/cars"
        className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
      >
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Cars
      </Link>

      <h2 className="text-2xl text-white font-light mb-8">
        Add Maintenance Record
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Car Selection */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Select Car</label>
          <select
            name="carId"
            value={formData.carId}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
          >
            <option value="">Choose a car...</option>
            {availableCars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.make} {car.model} ({car.year})
              </option>
            ))}
          </select>
        </div>

        {/* Maintenance Type */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Maintenance Type *
          </label>
          <input
            type="text"
            name="maintenanceType"
            value={formData.maintenanceType}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
            placeholder="e.g., Oil Change, Brake Service, Tire Rotation"
          />
        </div>

        {/* Scheduled Date */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Scheduled Date *
          </label>
          <input
            type="date"
            name="dateScheduled"
            value={formData.dateScheduled}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            required
          />
        </div>

        {/* Completion Date */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Completion Date (Optional)
          </label>
          <input
            type="date"
            name="dateCompleted"
            value={formData.dateCompleted}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Cost (Optional)
          </label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            placeholder="Enter cost in dollars"
            min="0"
            step="0.01"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-white/5 rounded-xl p-3 text-white border 
              border-white/10 focus:border-blue-500/50 focus:outline-none"
            rows="3"
            placeholder="Add any additional notes or details"
          />
        </div>

        {/* Submit Buttons */}
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
            disabled={isLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 
              rounded-xl transition-colors disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Maintenance"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMaintenance
