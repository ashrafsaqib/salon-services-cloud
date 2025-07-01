"use client"

import React, { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, MapPin, User, CreditCard, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Load your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

function StripeCardForm({ bookingId, amount, onPaymentSuccess }: { bookingId: string, amount: number, onPaymentSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  React.useEffect(() => {
    // Create PaymentIntent on mount
    const createPaymentIntent = async () => {
      setError("")
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amount,
            currency: "aed",
            description: `Order payment for #${bookingId}`
          })
        })
        if (!res.ok) throw new Error("Failed to create payment intent")
        const data = await res.json()
        setClientSecret(data.clientSecret)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Failed to initialize payment")
        }
      }
    }
    if (bookingId && amount) createPaymentIntent()
  }, [bookingId, amount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (!stripe || !elements) {
      setError("Stripe not loaded")
      setLoading(false)
      return
    }
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card element not found")
      setLoading(false)
      return
    }
    // Create PaymentMethod
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {},
    })
    if (pmError || !paymentMethod) {
      setError(pmError?.message || "Payment error")
      setLoading(false)
      return
    }
    // Call backend to process payment
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        amount: amount,
        currency: "aed",
        description: `Order payment for #${bookingId}`,
        order_ids: [Number(bookingId)]
      })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.message || "Payment failed")
      setLoading(false)
      return
    }
    onPaymentSuccess()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Card Information</Label>
        <div className="border rounded p-3">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg" disabled={loading || !clientSecret}>
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("booking")

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  // Mock booking data (in real app, fetch from API using bookingId)
  const mockBookingData = {
    id: bookingId,
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
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    },
    customer: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State 12345",
    },
    pricing: {
      subtotal: 55,
      tax: 4,
      total: 59,
    },
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

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Redirect to success page
    router.push(`/booking-confirmation?booking=${bookingId}`)
  }

  const handleStripeSuccess = () => {
    setIsProcessing(false)
    router.push(`/booking-confirmation?booking=${bookingId}`)
  }

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking</h1>
          <p className="text-gray-600 mb-6">The booking ID is missing or invalid.</p>
          <Button onClick={() => router.push("/book")} className="bg-rose-600 hover:bg-rose-700">
            Start New Booking
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your payment to confirm your booking</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Booking Details
              </CardTitle>
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
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>{formatDate(mockBookingData.date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-4 w-4 mr-3" />
                  <span>
                    {formatTime(mockBookingData.timeSlot)} ({mockBookingData.service.duration})
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span>At your location</span>
                </div>
              </div>

              <Separator />

              {/* Staff */}
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
                  <h4 className="font-medium text-gray-900">{mockBookingData.staff.name}</h4>
                  <p className="text-sm text-gray-600">{mockBookingData.staff.role}</p>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Customer Information
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{mockBookingData.customer.name}</p>
                  <p>{mockBookingData.customer.email}</p>
                  <p>{mockBookingData.customer.phone}</p>
                  <p>{mockBookingData.customer.address}</p>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${mockBookingData.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${mockBookingData.pricing.tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-rose-600">${mockBookingData.pricing.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method */}
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "card" && (
                process.env.NEXT_PUBLIC_STRIPE_KEY ? (
                  <Elements stripe={stripePromise}>
                    <StripeCardForm bookingId={bookingId} amount={mockBookingData.pricing.total} onPaymentSuccess={handleStripeSuccess} />
                  </Elements>
                ) : (
                  <div className="text-red-600">Stripe key not configured</div>
                )
              )}

              {paymentMethod === "cod" && (
                <div className="pt-4">
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </div>
                    ) : (
                      `Place Order (Cash on Delivery)`
                    )}
                  </Button>
                </div>
              )}

              <div className="text-xs text-gray-500 text-center space-y-2">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
