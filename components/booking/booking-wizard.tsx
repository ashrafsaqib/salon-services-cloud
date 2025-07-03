"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceSelectionStep } from "./steps/service-selection-step"
import { DateSelectionStep } from "./steps/date-selection-step"
import { SlotSelectionStep } from "./steps/slot-selection-step"
import { BookingSummaryStep } from "./steps/booking-summary-step"
import { CustomerDetailsStep } from "./steps/customer-details-step"
import type { Service, StaffMember, CustomerInfo, BookingData } from "@/types"

interface BookingWizardProps {
  initialServiceId?: number
  initialCategory?: string
  initialOptions?: number[]
}

const steps = [
  { id: 1, name: "Service" },
  { id: 2, name: "Date" },
  { id: 3, name: "Slot" },
  { id: 4, name: "Details" },
  { id: 5, name: "Summary" },
]

export function BookingWizard({ initialServiceId, initialCategory, initialOptions }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({ services: [] })
  const [customerDetails, setCustomerDetails] = useState<any>({
    name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    gender: "",
    affiliate_code: "",
    coupon_code: "",
    save_data: true,
    building_name: "",
    flat_or_villa: "",
    street: "",
    area: "Dubai",
    district: "",
    landmark: "",
    city: "",
    latitude: "",
    longitude: "",
  })
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [selectedOptions, setSelectedOptions] = useState<number[]>(initialOptions || [])
  const [isLoading, setIsLoading] = useState(false)
  const [totals, setTotals] = useState<any>(null)
  const router = useRouter()

  // Initialize with pre-selected service if provided
  useEffect(() => {
    const fetchAndSetService = async () => {
      if (initialServiceId) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search?id=${initialServiceId}`)  
          if (!res.ok) throw new Error("Failed to fetch services list")
          const data = await res.json()
          setBookingData((prev) => ({ ...prev, services: data.services}))
        } catch (e) {
          // Optionally handle error (e.g., show toast)
        }
      }
    }
    fetchAndSetService()
  }, [initialServiceId])

  // New: fetch staff and slots after date selection
  const handleDateSelect = async (date: string) => {
    if (!bookingData.services || !bookingData.services.length) return
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: bookingData.services.map(service => String(service.id)),
          date,
          area: "Dubai"
        })
      })
      if (!res.ok) throw new Error("Failed to fetch staff and slots")
      const data = await res.json()
      setBookingData((prev) => ({ ...prev, date, staff: undefined, timeSlot: undefined, staffAndSlotsData: data }))
      setCurrentStep(3)
    } catch (e) {
      setBookingData((prev) => ({ ...prev, date, staff: undefined, timeSlot: undefined, staffAndSlotsData: undefined }))
    } finally {
      setIsLoading(false)
    }
  }

  // In handleSlotSelect, store both slot and staff for summary
  const handleSlotSelect = (slot: any, staff: any) => {
    setSelectedSlot({ ...slot, staffId: staff.id })
    setBookingData((prev) => ({
      ...prev,
      staff,
      timeSlot: slot.id,
    }))
    setCurrentStep(4)
  }

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
        return (bookingData.services && bookingData.services.length > 0)
      case 2:
        return !!bookingData.date
      case 3:
        return !!bookingData.staff
      case 4:
        return !!bookingData.timeSlot
      case 5:
        return true
      case 6:
        return true
      default:
        return false
    }
  }

  // Helper to check if customer details are valid for Next button
  const isCustomerDetailsValid = () => {
    return (
      customerDetails.name?.trim() &&
      customerDetails.email?.trim() &&
      customerDetails.phone_number?.trim() &&
      customerDetails.whatsapp_number?.trim() &&
      customerDetails.gender?.trim() &&
      customerDetails.building_name?.trim() &&
      customerDetails.flat_or_villa?.trim() &&
      customerDetails.street?.trim() &&
      customerDetails.area?.trim() &&
      customerDetails.district?.trim() &&
      customerDetails.landmark?.trim() &&
      customerDetails.city?.trim()
    )
  }

  const handleFinalBooking = async () => {
    setIsLoading(true)
    try {
      // Prepare payload for /api/order
      const payload = {
        name: customerDetails.name,
        email: customerDetails.email,
        number_country_code: customerDetails.phone_country_code || "+92",
        number: customerDetails.phone_number || "3001234567",
        whatsapp_country_code: customerDetails.whatsapp_country_code || "+92",
        whatsapp: customerDetails.whatsapp_number || "3001234567",
        latitude: customerDetails.latitude || "24.8607",
        longitude: customerDetails.longitude || "67.0011",
        affiliate_code: customerDetails.affiliate_code || undefined,
        coupon_code: customerDetails.coupon_code || undefined,
        gender: customerDetails.gender || undefined,
        building_name: customerDetails.building_name || undefined,
        flat_or_villa: customerDetails.flat_or_villa || undefined,
        street: customerDetails.street || undefined,
        area: customerDetails.area || undefined,
        district: customerDetails.district || undefined,
        landmark: customerDetails.landmark || undefined,
        city: customerDetails.city || undefined,
        save_data: customerDetails.save_data,
        staffZone: {
          extra_charges: 100, // TODO: Replace with real value if available
          transport_charges: 200 // TODO: Replace with real value if available
        },
        bookingData: [
          {
            date: bookingData.date,
            service_staff_id: bookingData.staff?.id || 5, // fallback
            time_slot_id: bookingData.timeSlot || 3, // fallback
            service_ids: bookingData.services ? bookingData.services.map(s => Number(s.id)) : []
          }
        ]
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error("Order submission failed")
      // Optionally handle response (e.g., get booking/order id)
      const bookingId = Math.random().toString(36).substr(2, 9)
      router.push(`/checkout?booking=${bookingId}`)
    } catch (e) {
      // Optionally show error toast
      setIsLoading(false)
    }
  }

  const areaOptions = ["Dubai"] // You can expand this as needed

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelectionStep
            selectedServices={bookingData.services || []}
            initialCategory={initialCategory}
            onServiceSelect={(services) => setBookingData((prev) => ({ ...prev, services }))}
          />
        )
      case 2:
        return (
          <DateSelectionStep
            selectedDate={bookingData.date}
            service={bookingData.services && bookingData.services.length > 0 ? bookingData.services[0] : undefined}
            onDateSelect={handleDateSelect}
          />
        )
      case 3:
        return (
          <SlotSelectionStep
            slots={bookingData.staffAndSlotsData?.slots || []}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
          />
        )
      case 4:
        return (
          <CustomerDetailsStep
            customerDetails={customerDetails}
            onUpdate={setCustomerDetails}
            onApplyCoupon={(code) => setCustomerDetails((prev: any) => ({ ...prev, coupon_code: code }))}
            areaOptions={areaOptions}
            onNext={handleCustomerDetailsNext}
            onBack={prevStep}
          />
        )
      case 5:
        return (
          <BookingSummaryStep
            bookingData={{ ...bookingData, customerInfo: customerDetails }}
            totals={totals}
            onCustomerInfoUpdate={setCustomerDetails}
            onEditDetails={() => setCurrentStep(4)}
            onConfirmBooking={handleFinalBooking}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  // Call gettotals API when moving from details to summary
  const handleCustomerDetailsNext = async () => {
    setIsLoading(true)
    try {
      const payload = {
        customerDetails,
        services: bookingData.services,
        staff: bookingData.staff,
        timeSlot: bookingData.timeSlot,
        date: bookingData.date,
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gettotals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error("Failed to get totals")
      const data = await res.json()
      setTotals(data)
      setCurrentStep(5)
    } catch {
      // Optionally show error
    } finally {
      setIsLoading(false)
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
                <p className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"}`}>{step.name}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}`} />
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
            onClick={
              currentStep === 4
                ? handleCustomerDetailsNext
                : nextStep
            }
            disabled={
              !canProceed() ||
              (currentStep === 4 && !isCustomerDetailsValid())
            }
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
