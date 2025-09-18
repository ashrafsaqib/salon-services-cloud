"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Star, Clock, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import type { Service } from "@/types"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Utility for localStorage key
const BOOKING_SERVICES_KEY = "booking_selected_services"

// Helper to get and set services+options in localStorage
function getStoredServices(): {service: Service, options?: number[]}[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(BOOKING_SERVICES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function setStoredServices(services: {service: Service, options?: number[]}[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(BOOKING_SERVICES_KEY, JSON.stringify(services))
}

interface ServiceSelectionStepProps {
  selectedServices?: Service[]
  onServiceSelect: (services: Service[]) => void
  initialCategory?: string
}

export function ServiceSelectionStep({ selectedServices = [], onServiceSelect, initialCategory }: ServiceSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [storedServices, setStoredServicesState] = useState<{service: Service, options?: number[]}[]>([])
  const router = useRouter()

  const debouncedQuery = useDebounce(searchQuery, 300)

  // On mount, load from localStorage if available
  useEffect(() => {
    const stored = getStoredServices()
    setStoredServicesState(stored)
    if (stored.length > 0) {
      onServiceSelect(stored.map(s => s.service))
    }
  }, [])

  // Helper to update both localStorage and state
  const updateStoredServices = (servicesArr: {service: Service, options?: number[]}[]) => {
    setStoredServices(servicesArr)
    setStoredServicesState(servicesArr)
  }

  const handleServiceToggle = (service: Service) => {
    let updated: Service[]
    if (selectedServices.some((s) => s.id === service.id)) {
      updated = selectedServices.filter((s) => s.id !== service.id)
    } else {
      updated = [...selectedServices, service]
    }
    onServiceSelect(updated)
  }

  // Book button handler
  const handleBookService = (service: Service, options?: number[]) => {
    const stored = [...storedServices]
    const idx = stored.findIndex(s => s.service.id === service.id)
    if (idx > -1) {
      stored[idx] = { service, options }
    } else {
      stored.push({ service, options })
    }
    updateStoredServices(stored)
    onServiceSelect(stored.map(s => s.service))
  }

  // Remove service handler
  const handleRemoveService = (serviceId: number) => {
    const stored = storedServices.filter(s => s.service.id !== serviceId)
    updateStoredServices(stored)
    onServiceSelect(selectedServices.filter((s) => s.id !== serviceId))
  }

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setServices([])
        return
      }
      setIsLoading(true)
      try {
        let zoneId = '';
        if (typeof window !== 'undefined') {
          zoneId = localStorage.getItem('selected_zone_id') || '';
        }
        let url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(debouncedQuery.trim())}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`
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

  return (
    <div className="space-y-6">
      {/* Selected Services List */}
      {selectedServices.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected Services</h3>
          <div className="space-y-2">
            {selectedServices.map((service) => {
              // Find the stored entry for this service to get its options
              const stored = storedServices.find(s => s.service.id === service.id)
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      width={48}
                      height={48}
                      className="rounded object-cover border"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-base">{service.name}</div>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        {service.duration && (
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{service.duration}</span>
                        )}
                        {service.discount ? (
                          <span className="flex items-center gap-1 text-rose-600 font-medium">
                            <span className="text-gray-400 line-through mr-2">{service.price}</span>
                            <span>{service.discount}</span>
                          </span>
                        ) : (
                          service.price && (
                            <span className="flex items-center gap-1 text-rose-600 font-medium">{service.price}</span>
                          )
                        )}
                      </div>
                      {/* Show selected options if present */}
                      {stored?.options && stored.options.length > 0 && (
                        <div className="text-xs text-blue-700 mt-1">
                          Option{stored.options.length > 1 ? 's' : ''}: {stored.options.map((opt: any) => opt.name || opt.option_name).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-rose-600"
                    aria-label="Remove service"
                    onClick={() => handleRemoveService(service.id)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              )
            })}
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
              onClick={() => {
                if ((service.hasOptionsOrQuote) && service.slug) {
                  router.push(`/service/${service.slug}`);
                  return;
                }
                handleServiceToggle(service);
                if (isSelected) {
                  // Remove from storage if deselected
                  const updated = storedServices.filter(s => s.service.id !== service.id);
                  updateStoredServices(updated);
                }
              }}
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
                    {service.discount ? (
                      <>
                        <span className="text-gray-400 line-through mr-2">{service.price}</span>
                        <span>{service.discount}</span>
                      </>
                    ) : (
                      service.price
                    )}
                  </div>
                </div>
                <Button
                  className="mt-2 w-full bg-rose-600 hover:bg-rose-700"
                  onClick={e => {
                    if (service.hasOptionsOrQuote && service.slug) {
                      router.push(`/service/${service.slug}`);
                      return;
                    }
                    e.stopPropagation()
                    handleBookService(service)
                  }}
                >
                  {isSelected ? "Added" : "Book"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
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
