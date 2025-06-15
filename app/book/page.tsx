"use client"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BookingWizard } from "@/components/booking/booking-wizard"

export default function BookingPage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("serviceId")
  const categorySlug = searchParams.get("category")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Service</h1>
            <p className="text-gray-600">Complete your booking in just a few simple steps</p>
          </div>

          <BookingWizard
            initialServiceId={serviceId ? Number(serviceId) : undefined}
            initialCategory={categorySlug || undefined}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
