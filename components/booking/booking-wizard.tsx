"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceSelectionStep } from "./steps/service-selection-step"
import { DateSelectionStep } from "./steps/date-selection-step"
import { TimeSlotStep } from "./steps/time-slot-step"
import { StaffSelectionStep } from "./steps/staff-selection-step"
import { BookingSummaryStep } from "./steps/booking-summary-step"
import searchData from "@/data/search-data.json"
import type { Service } from "@/types"
interface StaffMember {
  id: number
  name: string
  role: string
  experience: string
  rating: number
  specialties: string[]
  image: string
  priceModifier?: number // Additional cost or discount
}

interface BookingData {
  service?: Service
  date?: string
  timeSlot?: string
  staff?: StaffMember
  customerInfo?: {
    name: string
    email: string
    phone: string
    address: string
    notes?: string
  }
}

interface BookingWizardProps {
  initialServiceId?: number
  initialCategory?: string
}

const steps = [
  { id: 1, name: "Service", description: "Choose your service" },
  { id: 2, name: "Date", description: "Select date" },
  { id: 3, name: "Time", description: "Pick time slot" },
  { id: 4, name: "Staff", description: "Choose professional" },
  { id: 5, name: "Summary", description: "Review & book" },
]

export function BookingWizard({ initialServiceId, initialCategory }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Initialize with pre-selected service if provided
  useEffect(() => {
    if (initialServiceId) {
      const service = searchData.services.find((s) => s.id === initialServiceId) as Service
      if (service) {
        setBookingData((prev) => ({ ...prev, service }))
        setCurrentStep(2) // Skip to date selection
      }
    }
  }, [initialServiceId])

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!bookingData.service
      case 2:
        return !!bookingData.date
      case 3:
        return !!bookingData.timeSlot
      case 4:
        return !!bookingData.staff
      case 5:
        return true
      default:
        return false
    }
  }

  const handleFinalBooking = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to checkout with booking data
    const bookingId = Math.random().toString(36).substr(2, 9)
    router.push(`/checkout?booking=${bookingId}`)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelectionStep
            selectedService={bookingData.service}
            initialCategory={initialCategory}
            onServiceSelect={(service) => updateBookingData({ service })}
          />
        )
      case 2:
        return (
          <DateSelectionStep
            selectedDate={bookingData.date}
            service={bookingData.service}
            onDateSelect={(date) => updateBookingData({ date })}
          />
        )
      case 3:
        return (
          <TimeSlotStep
            selectedTimeSlot={bookingData.timeSlot}
            selectedDate={bookingData.date}
            service={bookingData.service}
            onTimeSlotSelect={(timeSlot) => updateBookingData({ timeSlot })}
          />
        )
      case 4:
        return (
          <StaffSelectionStep
            selectedStaff={bookingData.staff}
            service={bookingData.service}
            date={bookingData.date}
            timeSlot={bookingData.timeSlot}
            onStaffSelect={(staff) => updateBookingData({ staff })}
          />
        )
      case 5:
        return (
          <BookingSummaryStep
            bookingData={bookingData}
            onCustomerInfoUpdate={(customerInfo) => updateBookingData({ customerInfo })}
            onConfirmBooking={handleFinalBooking}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"}`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-rose-600 hover:bg-rose-700 flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleFinalBooking}
            disabled={!canProceed() || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </Button>
        )}
      </div>
    </div>
  )
}
