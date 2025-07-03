"use client"

import React from "react"
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
  const ordersParam = searchParams.get("orders")
  const [orders, setOrders] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!ordersParam) return
    setLoading(true)
    setError(null)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getorders?orders=${ordersParam}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch order details")
        return res.json()
      })
      .then(data => {
        setOrders(data.orders || [])
      })
      .catch(err => setError(err.message || "Failed to load order details"))
      .finally(() => setLoading(false))
  }, [ordersParam])

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

  if (!ordersParam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking</h1>
          <p className="text-gray-600 mb-6">The order ID(s) are missing or invalid.</p>
          <Button onClick={() => router.push("/book")} className="bg-rose-600 hover:bg-rose-700">
            Start New Booking
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-gray-500 text-lg">Loading booking details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-red-500 text-lg">{error}</span>
      </div>
    )
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
            Confirmation Number: <span className="font-mono font-semibold">{orders.map(o => o.confirmation_number || o.id).join(", ")}</span>
          </p>
        </div>

        {/* Booking Details */}
        {orders.map((order, idx) => (
          <Card className="mb-6" key={order.id || idx}>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Services */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={order.order_services?.[0]?.image?.startsWith("http") ? order.order_services?.[0]?.image : `/service-images/${order.order_services?.[0]?.image}`}
                    alt={order.order_services?.[0]?.name || "Service"}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{order.order_services?.[0]?.name}</h3>
                  <p className="text-sm text-gray-600">{order.order_services?.[0]?.category || "-"}</p>
                  <p className="text-sm text-rose-600 font-medium">{order.order_services?.[0]?.duration}</p>
                </div>
              </div>
              <Separator />
              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-rose-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm">{formatDate(order.booking_date || order.date)}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-rose-600" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm">{formatTime(order.time_slot)}</p>
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
                        src={order.staff_image?.startsWith("http") ? order.staff_image : "/placeholder.svg"}
                        alt={order.staff_name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{order.staff_name}</p>
                      <p className="text-sm text-gray-600">{order.staff_role || ""}</p>
                      <p className="text-sm text-gray-500">{order.staff_phone || ""}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Service Address</h4>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{order.customer?.name}</p>
                    <p>{order.customer?.address}</p>
                    <p>{order.customer?.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

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
                    We've sent a confirmation email to {orders[0]?.customer?.email} with all the details.
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
                    {orders[0]?.staff_name} will call you 30 minutes before the appointment to confirm arrival.
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
