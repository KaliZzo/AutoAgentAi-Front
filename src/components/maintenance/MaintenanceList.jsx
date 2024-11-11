import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import {
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline"
import { toast } from "react-hot-toast"
import { maintenanceAPI } from "../../api"
import { carAPI } from "../../api"

const MaintenanceList = () => {
  const { carId } = useParams()
  const [selectedCarId, setSelectedCarId] = useState(carId || "all")
  const [cars, setCars] = useState([])
  const [maintenanceRecords, setMaintenanceRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch cars when component mounts
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carAPI.getAllCars()
        setCars(response.data.cars)
      } catch (error) {
        toast.error("Failed to fetch cars")
      }
    }
    fetchCars()
  }, [])

  // Fetch maintenance records when selectedCarId changes
  useEffect(() => {
    fetchMaintenanceRecords()
  }, [selectedCarId])

  const fetchMaintenanceRecords = async () => {
    try {
      setIsLoading(true)
      const response =
        selectedCarId === "all"
          ? await maintenanceAPI.getAllMaintenanceRecords()
          : await maintenanceAPI.getMaintenanceRecords(selectedCarId)
      setMaintenanceRecords(response.data.records)
    } catch (error) {
      toast.error("Failed to fetch maintenance records")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (maintenanceId) => {
    if (
      window.confirm("Are you sure you want to delete this maintenance record?")
    ) {
      try {
        await maintenanceAPI.deleteMaintenance(maintenanceId)
        toast.success("Maintenance record deleted successfully")
        fetchMaintenanceRecords()
      } catch (error) {
        toast.error("Failed to delete maintenance record")
      }
    }
  }

  const handleAddToCalendar = async (maintenance) => {
    try {
      setIsLoading(true)
      const result = await maintenanceAPI.addToCalendar(maintenance)
      toast.success("Successfully added to Google Calendar")
    } catch (error) {
      console.error("Calendar error:", error)
      toast.error(error.message || "Failed to add to calendar")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl text-white font-light">
                Maintenance Records
              </h2>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="bg-white/5 rounded-xl p-2 text-white border 
                  border-white/10 focus:border-blue-500/50 focus:outline-none"
              >
                <option value="all" className="bg-[#0A0A0A]">
                  All Cars
                </option>
                {cars.map((car) => (
                  <option
                    key={car._id}
                    value={car._id}
                    className="bg-[#0A0A0A]"
                  >
                    {car.make} {car.model} ({car.year})
                  </option>
                ))}
              </select>
            </div>
            <Link
              to={`/dashboard/maintenance/add`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white 
                rounded-xl hover:bg-blue-600 transition-colors"
            >
              Add Maintenance
            </Link>
          </div>

          {maintenanceRecords.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              No maintenance records found
            </div>
          ) : (
            maintenanceRecords.map((record) => (
              <div
                key={record._id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 
                  hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg text-white font-medium">
                      {record.maintenanceType}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-white/60 flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Scheduled:{" "}
                        {new Date(record.dateScheduled).toLocaleDateString()}
                      </p>
                      {record.dateCompleted && (
                        <p className="text-sm text-white/60">
                          Completed:{" "}
                          {new Date(record.dateCompleted).toLocaleDateString()}
                        </p>
                      )}
                      {record.cost && (
                        <p className="text-sm text-white/60">
                          Cost: ${record.cost}
                        </p>
                      )}
                    </div>
                    {record.notes && (
                      <p className="mt-3 text-sm text-white/60">
                        {record.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCalendar(record)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-blue-500 
                        hover:bg-white/10 rounded-lg transition-colors"
                      title="Add to Calendar"
                    >
                      <CalendarIcon className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/dashboard/maintenance/update/${record._id}`}
                      className="p-2 text-gray-400 hover:text-white 
                        hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="p-2 text-gray-400 hover:text-red-500 
                        hover:bg-white/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MaintenanceList
