"use client"
import { useSearchParams } from "next/navigation"
import Layout from "@/components/layout/layout"
import { BookingWizard } from "@/components/booking/booking-wizard"

export default function BookingPage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("serviceId")
  const categorySlug = searchParams.get("category")
  const options = searchParams.get("options")

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Service</h1>
            <p className="text-gray-600">Complete your booking in just a few simple steps</p>
          </div>

          <BookingWizard
            initialServiceId={serviceId ? Number(serviceId) : undefined}
            initialCategory={categorySlug || undefined}
            initialOptions={options ? JSON.parse(options) : undefined}
          />
        </div>
      </div>

      </Layout>
    </div>
  )
}
