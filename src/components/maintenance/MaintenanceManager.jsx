import React, { useState, useEffect } from "react"
import MaintenanceForm from "./MaintenanceForm"
import MaintenanceList from "./MaintenanceList"
import { maintenanceAPI } from "../../api"

const MaintenanceManager = ({ carId }) => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null)

  // Fetch maintenance records
  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true)
      const response = await maintenanceAPI.getMaintenanceRecords(carId)
      setMaintenanceRecords(response.data.records)
    } catch (error) {
      setError("Failed to fetch maintenance records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaintenanceRecords()
  }, [carId])

  // Handle maintenance deletion
  const handleDelete = async (maintenanceId) => {
    if (
      window.confirm("Are you sure you want to delete this maintenance record?")
    ) {
      try {
        await maintenanceAPI.deleteMaintenance(maintenanceId)
        fetchMaintenanceRecords() // Refresh the list
      } catch (error) {
        setError("Failed to delete maintenance record")
      }
    }
  }

  // Handle adding to calendar
  const handleAddToCalendar = async (maintenanceId) => {
    try {
      await maintenanceAPI.addToCalendar(maintenanceId)
      alert("Successfully added to Google Calendar!")
    } catch (error) {
      setError("Failed to add to calendar")
    }
  }

  return (
    <div className="p-6 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Maintenance Records</h2>
          <button
            onClick={() => {
              setEditingMaintenance(null)
              setIsFormOpen(true)
            }}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Add New Maintenance
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isFormOpen && (
          <MaintenanceForm
            carId={carId}
            maintenance={editingMaintenance}
            onClose={() => {
              setIsFormOpen(false)
              setEditingMaintenance(null)
            }}
            onSuccess={() => {
              fetchMaintenanceRecords()
              setIsFormOpen(false)
              setEditingMaintenance(null)
            }}
          />
        )}

        <MaintenanceList
          records={maintenanceRecords}
          onDelete={handleDelete}
          onEdit={(maintenance) => {
            setEditingMaintenance(maintenance)
            setIsFormOpen(true)
          }}
          onAddToCalendar={handleAddToCalendar}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default MaintenanceManager
