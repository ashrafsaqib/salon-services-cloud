"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Star, Clock, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import type { Service } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ServiceSelectionStepProps {
  selectedServices?: Service[]
  onServiceSelect: (services: Service[]) => void
  initialCategory?: string
}

export function ServiceSelectionStep({ selectedServices = [], onServiceSelect, initialCategory }: ServiceSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setServices([])
        return
      }
      setIsLoading(true)
      try {
        let url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(debouncedQuery.trim())}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch search results")
        let data = await res.json()
        let filtered = data.services || []
        setServices(filtered)
      } catch (error) {
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchResults()
  }, [debouncedQuery])

  const handleServiceToggle = (service: Service) => {
    let updated: Service[]
    if (selectedServices.some((s) => s.id === service.id)) {
      updated = selectedServices.filter((s) => s.id !== service.id)
    } else {
      updated = [...selectedServices, service]
    }
    onServiceSelect(updated)
  }

  return (
    <div className="space-y-6">
      {/* Selected Services List */}
      {selectedServices.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected Services</h3>
          <div className="flex flex-wrap gap-3">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-1 text-sm">
                <span className="mr-2 font-medium text-gray-900">{service.name}</span>
                <button
                  type="button"
                  className="ml-1 text-gray-400 hover:text-rose-600"
                  aria-label="Remove service"
                  onClick={() => onServiceSelect(selectedServices.filter((s) => s.id !== service.id))}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Services</h2>
        <p className="text-gray-600">Select one or more services you'd like to book</p>
      </div>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const isSelected = selectedServices.some((s) => s.id === service.id)
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? "ring-2 ring-rose-500 bg-rose-50" : "hover:shadow-md"}`}
              onClick={() => handleServiceToggle(service)}
            >
              <div className="h-32 bg-gray-200 relative">
                <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
                {isSelected && (
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
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.duration}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    At your location
                  </div>
                  <div className="flex items-center font-bold text-rose-600">
                    {service.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {services.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search</p>
        </div>
      )}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto animate-spin" />
          </div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      )}
    </div>
  )
}
