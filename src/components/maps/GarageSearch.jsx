import React, { useState } from "react"
import { Input, Card, Rate, Spin, Empty, Typography } from "antd"
import { PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons"
import { googleMapsAPI } from "../../api"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

const { Search } = Input
const { Text } = Typography

const GarageSearch = () => {
  const [garages, setGarages] = useState([])
  const [loading, setLoading] = useState(false)
  const [photoUrls, setPhotoUrls] = useState({})

  const getPhotoUrl = async (photoReference) => {
    try {
      const response = await googleMapsAPI.getPlacePhoto(photoReference)
      return response.photoUrl
    } catch (error) {
      console.error("Error fetching photo URL:", error)
      return null
    }
  }

  const handleSearch = async (location) => {
    if (!location) {
      toast.error("Please enter a location")
      return
    }

    try {
      setLoading(true)
      const response = await googleMapsAPI.findNearbyGarages(location)
      setGarages(response.garages)

      const urls = {}
      for (const garage of response.garages) {
        if (garage.photos?.[0]?.photo_reference) {
          urls[garage.place_id] = await getPhotoUrl(
            garage.photos[0].photo_reference
          )
        }
      }
      setPhotoUrls(urls)
    } catch (error) {
      console.error("Error searching garages:", error)
      toast.error("Failed to find garages")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-4xl mx-auto p-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <Search
            placeholder="Enter location (e.g., Tel Aviv)"
            enterButton="Search"
            size="large"
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        ) : garages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {garages.map((garage) => (
              <Card
                key={garage.place_id}
                hoverable
                className="h-full"
                cover={
                  photoUrls[garage.place_id] ? (
                    <img
                      alt={garage.name}
                      src={photoUrls[garage.place_id]}
                      className="h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={garage.name}
                  description={
                    <div className="space-y-2">
                      <div>
                        <Rate
                          disabled
                          defaultValue={garage.rating || 0}
                          className="text-sm"
                        />
                        <span className="ml-2 text-gray-500">
                          ({garage.user_ratings_total || 0} reviews)
                        </span>
                      </div>

                      {garage.vicinity && (
                        <div className="flex items-start space-x-2">
                          <EnvironmentOutlined className="mt-1 text-gray-400" />
                          <Text className="text-gray-600">
                            {garage.vicinity}
                          </Text>
                        </div>
                      )}

                      {garage.formatted_phone_number && (
                        <div className="flex items-center space-x-2">
                          <PhoneOutlined className="text-gray-400" />
                          <Text className="text-gray-600">
                            {garage.formatted_phone_number}
                          </Text>
                        </div>
                      )}

                      {garage.opening_hours?.open_now !== undefined && (
                        <Text
                          className={`${
                            garage.opening_hours.open_now
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {garage.opening_hours.open_now
                            ? "Open Now"
                            : "Closed"}
                        </Text>
                      )}
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="No garages found" />
        )}
      </div>
    </div>
  )
}

export default GarageSearch
