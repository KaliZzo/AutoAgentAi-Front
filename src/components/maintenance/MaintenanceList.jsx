import React from "react"

const MaintenanceList = ({
  records,
  onDelete,
  onEdit,
  onAddToCalendar,
  loading,
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (!records.length) {
    return <div className="text-center py-4">No maintenance records found.</div>
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record._id}
          className="bg-gray-900 rounded-lg p-4 border border-gray-800"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{record.maintenanceType}</h3>
              <p className="text-gray-400 text-sm">
                Scheduled: {new Date(record.dateScheduled).toLocaleDateString()}
              </p>
              {record.dateCompleted && (
                <p className="text-gray-400 text-sm">
                  Completed:{" "}
                  {new Date(record.dateCompleted).toLocaleDateString()}
                </p>
              )}
              {record.cost && (
                <p className="text-gray-400 text-sm">Cost: ${record.cost}</p>
              )}
              {record.notes && (
                <p className="text-gray-400 mt-2">{record.notes}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onAddToCalendar(record._id)}
                className="p-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Add to Calendar
              </button>
              <button
                onClick={() => onEdit(record)}
                className="p-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(record._id)}
                className="p-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MaintenanceList
