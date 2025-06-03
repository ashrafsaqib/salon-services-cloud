"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, MapPin, Check, Download, Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("booking")

  // Mock booking data
  const mockBookingData = {
    id: bookingId,
    confirmationNumber: "LP" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    service: {
      name: "Hair Styling & Cut",
      category: "Ladies Salon",
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1000&auto=format&fit=crop",
    },
    date: "2024-01-15",
    timeSlot: "14:00",
    staff: {
      name: "Sarah Martinez",
      role: "Senior Hair Stylist",
      phone: "+1 (555) 987-6543",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    },
    customer: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State 12345",
    },
    pricing: {
      total: 59,
    },
    status: "confirmed",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your appointment has been successfully booked</p>
          <p className="text-sm text-gray-500 mt-2">
            Confirmation Number: <span className="font-mono font-semibold">{mockBookingData.confirmationNumber}</span>
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={mockBookingData.service.image || "/placeholder.svg"}
                  alt={mockBookingData.service.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{mockBookingData.service.name}</h3>
                <p className="text-sm text-gray-600">{mockBookingData.service.category}</p>
                <p className="text-sm text-rose-600 font-medium">{mockBookingData.service.duration}</p>
              </div>
            </div>

            <Separator />

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-rose-600" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm">{formatDate(mockBookingData.date)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3 text-rose-600" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm">{formatTime(mockBookingData.timeSlot)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-rose-600" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm">At your address</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Staff & Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Your Professional</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={mockBookingData.staff.image || "/placeholder.svg"}
                      alt={mockBookingData.staff.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{mockBookingData.staff.name}</p>
                    <p className="text-sm text-gray-600">{mockBookingData.staff.role}</p>
                    <p className="text-sm text-gray-500">{mockBookingData.staff.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Service Address</h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{mockBookingData.customer.name}</p>
                  <p>{mockBookingData.customer.address}</p>
                  <p>{mockBookingData.customer.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" className="flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <Share2 className="h-4 w-4 mr-2" />
            Share Booking
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-rose-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Confirmation Email Sent</p>
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email to {mockBookingData.customer.email} with all the details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-rose-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Professional Will Contact You</p>
                  <p className="text-sm text-gray-600">
                    {mockBookingData.staff.name} will call you 30 minutes before the appointment to confirm arrival.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-rose-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Prepare for Your Service</p>
                  <p className="text-sm text-gray-600">
                    Make sure you have a suitable space ready and any specific requirements mentioned during booking.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
            Back to Home
          </Button>
          <Button onClick={() => router.push("/book")} className="bg-rose-600 hover:bg-rose-700 flex-1">
            Book Another Service
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
