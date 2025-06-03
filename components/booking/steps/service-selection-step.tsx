"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Star, Clock, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/hooks/use-debounce"
import searchData from "@/data/search-data.json"

interface Service {
  id: number
  name: string
  category: string
  categorySlug: string
  serviceSlug: string
  price: string
  duration: string
  description: string
  image: string
  keywords: string[]
}

interface ServiceSelectionStepProps {
  selectedService?: Service
  initialCategory?: string
  onServiceSelect: (service: Service) => void
}

const categories = [
  { name: "All Services", value: "all" },
  { name: "Ladies Salon", value: "ladies-salon" },
  { name: "Gents Salon", value: "gents-salon" },
  { name: "Automotive", value: "automotive" },
]

export function ServiceSelectionStep({ selectedService, initialCategory, onServiceSelect }: ServiceSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all")
  const [filteredServices, setFilteredServices] = useState<Service[]>([])

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    let services = searchData.services as Service[]

    // Filter by category
    if (selectedCategory !== "all") {
      services = services.filter((service) => service.categorySlug === selectedCategory)
    }

    // Filter by search query
    if (debouncedQuery.trim()) {
      const lowercaseQuery = debouncedQuery.toLowerCase()
      services = services.filter(
        (service) =>
          service.name.toLowerCase().includes(lowercaseQuery) ||
          service.category.toLowerCase().includes(lowercaseQuery) ||
          service.description.toLowerCase().includes(lowercaseQuery) ||
          service.keywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery)),
      )
    }

    setFilteredServices(services)
  }, [selectedCategory, debouncedQuery])

  const handleServiceSelect = (service: Service) => {
    onServiceSelect(service)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service</h2>
        <p className="text-gray-600">Select the service you'd like to book</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedService?.id === service.id ? "ring-2 ring-rose-500 bg-rose-50" : "hover:shadow-md"
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="h-32 bg-gray-200 relative">
              <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
              {selectedService?.id === service.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-xs">4.8</span>
                </div>
              </div>

              <p className="text-xs text-rose-600 font-medium mb-2">{service.category}</p>
              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {service.duration}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  At your location
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-rose-600">{service.price}</span>
                <Button
                  size="sm"
                  variant={selectedService?.id === service.id ? "default" : "outline"}
                  className={selectedService?.id === service.id ? "bg-rose-600 hover:bg-rose-700" : ""}
                >
                  {selectedService?.id === service.id ? "Selected" : "Select"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  )
}
