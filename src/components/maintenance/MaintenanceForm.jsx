import React, { useState, useEffect } from "react"
import { maintenanceAPI } from "../../api"

const MaintenanceForm = ({ carId, maintenance, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    maintenanceType: "",
    dateScheduled: "",
    dateCompleted: "",
    cost: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (maintenance) {
      setFormData({
        maintenanceType: maintenance.maintenanceType,
        dateScheduled: maintenance.dateScheduled?.split("T")[0] || "",
        dateCompleted: maintenance.dateCompleted?.split("T")[0] || "",
        cost: maintenance.cost || "",
        notes: maintenance.notes || "",
      })
    }
  }, [maintenance])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (maintenance) {
        await maintenanceAPI.updateMaintenance(maintenance._id, {
          ...formData,
          carId,
        })
      } else {
        await maintenanceAPI.addMaintenance({
          ...formData,
          carId,
        })
      }
      onSuccess()
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to save maintenance record"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {maintenance ? "Edit Maintenance" : "Add Maintenance"}
        </h3>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input
              type="text"
              name="maintenanceType"
              value={formData.maintenanceType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Scheduled Date
            </label>
            <input
              type="date"
              name="dateScheduled"
              value={formData.dateScheduled}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Completion Date
            </label>
            <input
              type="date"
              name="dateCompleted"
              value={formData.dateCompleted}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MaintenanceForm
