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
import type { Service, BookingData } from "@/types"
import { getStoredServices, getUserIdFromStorage, getSelectedZoneId } from "@/lib/storage"

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
  const [isLoading, setIsLoading] = useState(false)
  const [totals, setTotals] = useState<any>(null)
  const [holidays, setHolidays] = useState<string[]>([])
  const [holidaysLoaded, setHolidaysLoaded] = useState(false)
  const [pendingDateStep, setPendingDateStep] = useState(false)
  const [slotsLoaded, setSlotsLoaded] = useState(false)
  const [totalsError, setTotalsError] = useState<string | null>(null)
  const [slotsError, setSlotsError] = useState<string | null>(null)
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

  // New: fetch holidays before showing date step
  const handleServiceNext = async () => {
    setIsLoading(true)
    setPendingDateStep(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/holidays`)
      if (!res.ok) throw new Error("Failed to fetch holidays")
      const data = await res.json()
      setHolidays(data.dates || [])
      setHolidaysLoaded(true)
      setCurrentStep(2)
    } catch {
      setHolidays([])
      setHolidaysLoaded(true)
      setCurrentStep(2)
    } finally {
      setIsLoading(false)
      setPendingDateStep(false)
    }
  }

  // New: fetch staff and slots after date selection
  const handleDateSelect = async (date: string) => {
    if (!bookingData.services || !bookingData.services.length) return
    setIsLoading(true)
    setSlotsLoaded(false)
    setSlotsError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: bookingData.services.map(service => String(service.id)),
          date,
          area: "Dubai",
          zone_id: getSelectedZoneId() || undefined,
        })
      })
      if (!res.ok) throw new Error("Failed to fetch staff and slots")
      const data = await res.json()
      setBookingData((prev) => ({ ...prev, date, staff: undefined, timeSlot: undefined, staffAndSlotsData: data }))
      const hasSlots = !!(data && data.slots && data.slots.length > 0)
      setSlotsLoaded(hasSlots)
      if (!hasSlots) {
        setSlotsError("No slots available for this date. Please select another date.")
      }
      setCurrentStep(3)
    } catch (e) {
      setBookingData((prev) => ({ ...prev, date, staff: undefined, timeSlot: undefined, staffAndSlotsData: undefined }))
      setSlotsLoaded(false)
      setSlotsError("No slots available for this date. Please select another date.")
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

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setTotalsError(null)
    setSlotsError(null)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (bookingData.services && bookingData.services.length > 0)
      case 2:
        return !!bookingData.date && slotsLoaded
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
      // Prepare bookingData array with service ids and option ids
      const bookingDataArr = (bookingData.services || []).map((s: any) => {
        const stored = getStoredServices().find((ss: any) => ss.service.id === s.id)
        return {
          service_id: s.id,
          option_ids: stored?.options ? stored.options.map((o: any) => o.id) : undefined
        }
      })
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
        coupon_code: customerDetails.coupon_code || bookingData.customerInfo?.coupon_code || undefined,
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
        user_id: getUserIdFromStorage(),
        zone_id: getSelectedZoneId() || undefined,
        bookingData: [
          {
        date: bookingData.date,
        service_staff_id: bookingData.staff?.id || 5, // fallback
        time_slot_id: bookingData.timeSlot || 3, // fallback
        services: bookingDataArr
          }
        ]
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error("Order submission failed")
      const orderData = await res.json()
      // Redirect to checkout with booking/order id and total
      const orderIds = Array.isArray(orderData.order_ids) ? orderData.order_ids : []
      const total = orderData.Total
      if (orderIds.length > 0 && total) {
        router.push(`/checkout?orders=${orderIds.join(",")}&total=${total}`)
      } else {
        // fallback
        router.push("/checkout")
      }
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
        return holidaysLoaded ? (
          <DateSelectionStep
            selectedDate={bookingData.date}
            service={bookingData.services && bookingData.services.length > 0 ? bookingData.services[0] : undefined}
            onDateSelect={handleDateSelect}
            holidays={holidays}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading calendar...</p>
          </div>
        )
      case 3:
        return (
          <SlotSelectionStep
            slots={bookingData.staffAndSlotsData?.slots || []}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
          />
        )
      case 4: {
        // Prepare the same bookingData payload as used for gettotals
        const bookingDataArr = (bookingData.services || []).map((s: any) => {
          const stored = getStoredServices().find((ss: any) => ss.service.id === s.id)
          return {
            service_id: s.id,
            option_ids: stored?.options ? stored.options.map((o: any) => o.id) : undefined
          }
        })
        const getTotalsPayload = {
          name: customerDetails.name,
          email: customerDetails.email,
          number_country_code: customerDetails.phone_country_code || "+92",
          number: customerDetails.phone_number || "3001234567",
          whatsapp_country_code: customerDetails.whatsapp_country_code || "+92",
          whatsapp: customerDetails.whatsapp_number || "3001234567",
          latitude: customerDetails.latitude || "24.8607",
          longitude: customerDetails.longitude || "67.0011",
          affiliate_code: customerDetails.affiliate_code || undefined,
          coupon_code: customerDetails.coupon_code || bookingData.customerInfo?.coupon_code || undefined,
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
          user_id: getUserIdFromStorage(),
          zone_id: getSelectedZoneId() || undefined,
          bookingData: [
            {
              date: bookingData.date,
              service_staff_id: bookingData.staff?.id || 5, // fallback
              time_slot_id: bookingData.timeSlot || 3, // fallback
              services: bookingDataArr
            }
          ]
        }
        return (
          <CustomerDetailsStep
            customerDetails={customerDetails}
            onUpdate={setCustomerDetails}
            onApplyCoupon={(code) => setCustomerDetails((prev: any) => ({ ...prev, coupon_code: code }))}
            areaOptions={areaOptions}
            onNext={handleCustomerDetailsNext}
            onBack={prevStep}
            bookingData={getTotalsPayload}
            userId={getUserIdFromStorage()}
          />
        )
      }
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
    setTotalsError(null)
    try {
      // Prepare bookingData array with service ids and option ids
      const bookingDataArr = (bookingData.services || []).map((s: any) => {
        const stored = getStoredServices().find((ss: any) => ss.service.id === s.id)
        return {
          service_id: s.id,
          option_ids: stored?.options ? stored.options.map((o: any) => o.id) : undefined
        }
      })
      // Prepare payload for /api/gettotals
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
        coupon_code: customerDetails.coupon_code || bookingData.customerInfo?.coupon_code || undefined,
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
        user_id: getUserIdFromStorage(),
        zone_id: getSelectedZoneId() || undefined,
        bookingData: [
          {
            date: bookingData.date,
            service_staff_id: bookingData.staff?.id || 5, // fallback
            time_slot_id: bookingData.timeSlot || 3, // fallback
            services: bookingDataArr
          }
        ]
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gettotals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.error) {
        setTotalsError(typeof data.error === "string" ? data.error : "Unable to calculate totals. Please check your details and try again.")
        return
      }
      if (!res.ok) throw new Error("Failed to get totals")
      setTotals(data)
      setCurrentStep(5)
    } catch (err) {
      setTotalsError("Unable to calculate totals. Please check your details and try again.")
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

      {/* Universal Error Message Section */}
      {(totalsError || slotsError) && (
        <div className="text-center text-red-600 font-medium mb-2">
          {totalsError || slotsError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep === 1 ? (
          <Button
            onClick={handleServiceNext}
            disabled={!canProceed() || isLoading}
            className="bg-rose-600 hover:bg-rose-700 flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : currentStep < steps.length ? (
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
