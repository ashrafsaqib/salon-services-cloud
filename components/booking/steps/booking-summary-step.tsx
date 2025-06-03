"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, User, CreditCard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

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
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  notes?: string
}

interface BookingData {
  service?: Service
  date?: string
  timeSlot?: string
  staff?: StaffMember
  customerInfo?: CustomerInfo
}

interface BookingSummaryStepProps {
  bookingData: BookingData
  onCustomerInfoUpdate: (customerInfo: CustomerInfo) => void
  onConfirmBooking: () => void
  isLoading: boolean
}

export function BookingSummaryStep({
  bookingData,
  onCustomerInfoUpdate,
  onConfirmBooking,
  isLoading,
}: BookingSummaryStepProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(
    bookingData.customerInfo || {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  )

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    const updatedInfo = { ...customerInfo, [field]: value }
    setCustomerInfo(updatedInfo)
    onCustomerInfoUpdate(updatedInfo)
  }

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":")
    const hourNum = Number.parseInt(hour)
    const ampm = hourNum >= 12 ? "PM" : "AM"
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateTotal = () => {
    if (!bookingData.service) return 0

    const basePrice = Number.parseInt(bookingData.service.price.replace("$", ""))
    const staffModifier = bookingData.staff?.priceModifier || 0
    const subtotal = basePrice + staffModifier
    const tax = Math.round(subtotal * 0.08) // 8% tax

    return {
      subtotal,
      tax,
      total: subtotal + tax,
    }
  }

  const pricing = calculateTotal()

  const isFormValid = () => {
    return customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.address
  }

  if (!bookingData.service || !bookingData.date || !bookingData.timeSlot || !bookingData.staff) {
    return (
      <div className="text-center py-8">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Please complete all previous steps</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Book</h2>
        <p className="text-gray-600">Review your booking details and provide your information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Service */}
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={bookingData.service.image || "/placeholder.svg"}
                  alt={bookingData.service.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{bookingData.service.name}</h3>
                <p className="text-sm text-gray-600">{bookingData.service.category}</p>
                <p className="text-sm text-rose-600 font-medium">{bookingData.service.duration}</p>
              </div>
            </div>

            <Separator />

            {/* Date & Time */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium">{formatDate(bookingData.date)}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-medium">
                  {formatTime(bookingData.timeSlot)} ({bookingData.service.duration})
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">At your location</span>
              </div>
            </div>

            <Separator />

            {/* Staff */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={bookingData.staff.image || "/placeholder.svg"}
                  alt={bookingData.staff.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{bookingData.staff.name}</h4>
                <p className="text-sm text-gray-600">{bookingData.staff.role}</p>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-xs">{bookingData.staff.rating}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service</span>
                <span>{bookingData.service.price}</span>
              </div>
              {bookingData.staff.priceModifier && bookingData.staff.priceModifier > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Professional fee</span>
                  <span>+${bookingData.staff.priceModifier}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${pricing.tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-rose-600">${pricing.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="address">Service Address *</Label>
              <Textarea
                id="address"
                value={customerInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter the address where service should be provided"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Special Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={customerInfo.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any special instructions or requests"
                rows={3}
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={onConfirmBooking}
                disabled={!isFormValid() || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Booking...
                  </div>
                ) : (
                  `Confirm Booking - $${pricing.total}`
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By confirming this booking, you agree to our Terms of Service and Privacy Policy. You will be redirected
              to secure payment processing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
