"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface StaffMember {
  id: number
  name: string
  role: string
  experience: string
  rating: number
  specialties: string[]
  image: string
  priceModifier?: number
  bio?: string
  available?: boolean
}

interface StaffSelectionStepProps {
  selectedStaff?: StaffMember
  service?: Service
  date?: string
  timeSlot?: string
  onStaffSelect: (staff: StaffMember) => void
}

export function StaffSelectionStep({ selectedStaff, service, date, timeSlot, onStaffSelect }: StaffSelectionStepProps) {
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([])

  useEffect(() => {
    if (service && date && timeSlot) {
      // Mock staff data based on service category
      const mockStaff: StaffMember[] = []

      if (service.categorySlug === "ladies-salon") {
        mockStaff.push(
          {
            id: 1,
            name: "Sarah Martinez",
            role: "Senior Hair Stylist",
            experience: "8+ years",
            rating: 4.9,
            specialties: ["Hair Color", "Bridal Styling", "Cuts"],
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
            priceModifier: 10,
            bio: "Specializes in modern cuts and color techniques. Certified in advanced hair styling.",
            available: Math.random() > 0.2,
          },
          {
            id: 2,
            name: "Emily Rodriguez",
            role: "Beauty Specialist",
            experience: "6+ years",
            rating: 4.8,
            specialties: ["Facials", "Makeup", "Skincare"],
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
            priceModifier: 5,
            bio: "Expert in skincare treatments and makeup application for all occasions.",
            available: Math.random() > 0.2,
          },
          {
            id: 3,
            name: "Jessica Chen",
            role: "Hair Stylist",
            experience: "4+ years",
            rating: 4.7,
            specialties: ["Cuts", "Styling", "Treatments"],
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
            priceModifier: 0,
            bio: "Passionate about creating beautiful, manageable styles for everyday wear.",
            available: Math.random() > 0.2,
          },
        )
      } else if (service.categorySlug === "gents-salon") {
        mockStaff.push(
          {
            id: 4,
            name: "Michael Chen",
            role: "Master Barber",
            experience: "10+ years",
            rating: 4.8,
            specialties: ["Classic Cuts", "Beard Styling", "Hot Towel Shave"],
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
            priceModifier: 8,
            bio: "Traditional barbering techniques with modern styling expertise.",
            available: Math.random() > 0.2,
          },
          {
            id: 5,
            name: "David Wilson",
            role: "Barber",
            experience: "5+ years",
            rating: 4.6,
            specialties: ["Modern Cuts", "Styling", "Grooming"],
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
            priceModifier: 0,
            bio: "Specializes in contemporary men's cuts and grooming services.",
            available: Math.random() > 0.2,
          },
        )
      } else if (service.categorySlug === "automotive") {
        mockStaff.push(
          {
            id: 6,
            name: "David Thompson",
            role: "Auto Detailing Expert",
            experience: "12+ years",
            rating: 4.7,
            specialties: ["Paint Protection", "Interior Detailing", "Ceramic Coating"],
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
            priceModifier: 15,
            bio: "Certified in advanced automotive detailing and paint protection systems.",
            available: Math.random() > 0.2,
          },
          {
            id: 7,
            name: "Robert Garcia",
            role: "Auto Technician",
            experience: "7+ years",
            rating: 4.5,
            specialties: ["Car Wash", "Interior Cleaning", "Maintenance"],
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
            priceModifier: 0,
            bio: "Experienced in all aspects of automotive care and maintenance.",
            available: Math.random() > 0.2,
          },
        )
      }

      setAvailableStaff(mockStaff.filter((staff) => staff.available))
    }
  }, [service, date, timeSlot])

  const calculatePrice = (basePrice: string, modifier?: number) => {
    const price = Number.parseInt(basePrice.replace("$", ""))
    const finalPrice = modifier ? price + modifier : price
    return `$${finalPrice}`
  }

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":")
    const hourNum = Number.parseInt(hour)
    const ampm = hourNum >= 12 ? "PM" : "AM"
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  if (!service || !date || !timeSlot) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Please complete the previous steps first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Professional</h2>
        <p className="text-gray-600">
          Select a professional for your {service.name} appointment on{" "}
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          at {formatTime(timeSlot)}
        </p>
      </div>

      {availableStaff.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No staff available</h3>
            <p className="text-gray-600">Please try a different date or time slot</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableStaff.map((staff) => (
            <Card
              key={staff.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedStaff?.id === staff.id ? "ring-2 ring-rose-500 bg-rose-50" : "hover:shadow-md"
              }`}
              onClick={() => onStaffSelect(staff)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={staff.image || "/placeholder.svg"}
                        alt={staff.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    {selectedStaff?.id === staff.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
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

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{staff.rating}</span>
                      </div>
                    </div>

                    <p className="text-rose-600 font-medium text-sm mb-2">{staff.role}</p>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Award className="h-4 w-4 mr-1" />
                      {staff.experience}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {staff.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {staff.bio && <p className="text-gray-600 text-sm mb-4">{staff.bio}</p>}

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-rose-600">
                          {calculatePrice(service.price, staff.priceModifier)}
                        </span>
                        {staff.priceModifier && staff.priceModifier > 0 && (
                          <span className="text-xs text-gray-500 ml-2">(+${staff.priceModifier})</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={selectedStaff?.id === staff.id ? "default" : "outline"}
                        className={selectedStaff?.id === staff.id ? "bg-rose-600 hover:bg-rose-700" : ""}
                      >
                        {selectedStaff?.id === staff.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedStaff && (
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={selectedStaff.image || "/placeholder.svg"}
                  alt={selectedStaff.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-rose-900">Selected Professional</p>
                <p className="text-sm text-rose-700">
                  {selectedStaff.name} - {selectedStaff.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
