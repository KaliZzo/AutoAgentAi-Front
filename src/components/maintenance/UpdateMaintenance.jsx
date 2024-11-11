import React, { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { maintenanceAPI } from "../../api"
import { toast } from "react-hot-toast"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const UpdateMaintenance = () => {
  const { maintenanceId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    maintenanceType: "",
    dateScheduled: "",
    dateCompleted: "",
    cost: "",
    notes: "",
  })

  // Fetch maintenance record when component mounts
  useEffect(() => {
    const fetchMaintenanceRecord = async () => {
      try {
        const response = await maintenanceAPI.getMaintenanceById(maintenanceId)
        const record = response.data.maintenance
        setFormData({
          maintenanceType: record.maintenanceType,
          dateScheduled: record.dateScheduled.split("T")[0],
          dateCompleted: record.dateCompleted
            ? record.dateCompleted.split("T")[0]
            : "",
          cost: record.cost || "",
          notes: record.notes || "",
        })
      } catch (error) {
        toast.error("Failed to fetch maintenance record")
        navigate(-1)
      }
    }
    fetchMaintenanceRecord()
  }, [maintenanceId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await maintenanceAPI.updateMaintenance(maintenanceId, formData)
      toast.success("Maintenance record updated successfully")
      navigate(-1)
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update maintenance record"
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
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to="/dashboard/maintenance/all"
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Maintenance List
        </Link>

        <h2 className="text-2xl text-white font-light mb-8">
          Update Maintenance Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
              {isLoading ? "Updating..." : "Update Maintenance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateMaintenance
