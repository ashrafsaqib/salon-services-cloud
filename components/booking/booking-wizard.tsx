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
  // Change selectedSlot to selectedSlots (object: groupIdx -> {slot, staff})
  const [selectedSlots, setSelectedSlots] = useState<{ [groupIdx: number]: { slot: any, staff: any } }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [totals, setTotals] = useState<any>(null)
  const [holidays, setHolidays] = useState<string[]>([])
  const [holidaysLoaded, setHolidaysLoaded] = useState(false)
  const [pendingDateStep, setPendingDateStep] = useState(false)
  const [slotsLoaded, setSlotsLoaded] = useState(false)
  const [totalsError, setTotalsError] = useState<string | null>(null)
  const [customerValidationErrors, setCustomerValidationErrors] = useState<string[]>([])
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/slots-by-group`, {
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
      // Fix: check for slots in groups
      const hasSlots = !!(data && data.groups && data.groups.some((g: any) => g.slots && g.slots.length > 0))
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
  // Now, after all groups are selected, merge into bookingData
  const handleSlotStepNext = () => {
    // Merge all selected slots/staff into bookingData
    const groups = bookingData.staffAndSlotsData?.groups || []
    // For now, just pick the first group's slot/staff for legacy fields
    const first = selectedSlots[0] || {}
    setBookingData(prev => ({
      ...prev,
      staff: first.staff,
      timeSlot: first.slot?.id,
      selectedSlots, // store all selections for summary/submit
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

  // Update canProceed for step 3: require a selection for every group
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (bookingData.services && bookingData.services.length > 0)
      case 2:
        return !!bookingData.date && slotsLoaded
      case 3:
        const groups = bookingData.staffAndSlotsData?.groups || []
        return groups.length > 0 && groups.every((_, idx) => selectedSlots[idx])
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

  // Helper to validate phone numbers (must be at least 10 digits and start with '+')
  const isValidPhoneNumber = (num: string | undefined) => {
    if (!num) return false;
    const digits = num.replace(/\D/g, "");
    return num.startsWith("+") && digits.length >= 10 && digits.length <= 15;
  };

  // Helper to check if customer details are valid for Next button
  // Returns array of error messages (empty if valid)
  const isCustomerDetailsValid = () => {
    const errors = [];
    if (!customerDetails.name?.trim()) errors.push("Name is required.");
    if (!customerDetails.email?.trim()) {
      errors.push("Email is required.");
    } else {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerDetails.email)) errors.push("Email is not valid.");
    }
    if (!isValidPhoneNumber(customerDetails.phone_number)) errors.push("Phone number is missing or invalid.");
    if (!isValidPhoneNumber(customerDetails.whatsapp_number)) errors.push("Whatsapp number is missing or invalid.");
    if (!customerDetails.gender?.trim()) errors.push("Gender is required.");
    if (!customerDetails.building_name?.trim()) errors.push("Building name is required.");
    if (!customerDetails.flat_or_villa?.trim()) errors.push("Flat or villa is required.");
    if (!customerDetails.street?.trim()) errors.push("Street is required.");
    if (!customerDetails.area?.trim()) errors.push("Area is required.");
    if (!customerDetails.district?.trim()) errors.push("District is required.");
    if (!customerDetails.landmark?.trim()) errors.push("Landmark is required.");
    if (!customerDetails.city?.trim()) errors.push("City is required.");
    return errors;
  }

  const buildBookingDataArray = () => {
    const groups = bookingData.staffAndSlotsData?.groups || [];
    return groups.map((group: any, idx: number) => {
      const sel = selectedSlots[idx];
      return {
        date: bookingData.date,
        service_staff_id: sel?.staff?.id,
        time_slot_id: sel?.slot?.id,
        services: (group.services || []).map((sid: number) => {
          const stored = getStoredServices().find((ss: any) => ss.service.id === sid);
          return {
            service_id: sid,
            option_ids: stored?.options ? stored.options.map((o: any) => o.id) : []
          };
        })
      };
    });
  }

  const handleFinalBooking = async () => {
    setIsLoading(true)
    try {
      // Build bookingData array for payload
      const bookingDataArr = buildBookingDataArray();
      // Prepare payload for /api/order
      const payload = {
        name: customerDetails.name,
        email: customerDetails.email,
        number: customerDetails.phone_number || "3001234567",
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
        user_id: getUserIdFromStorage(),
        zone_id: getSelectedZoneId() || undefined,
        bookingData: bookingDataArr
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
        // New: Pass groups to SlotSelectionStep
        return (
          <SlotSelectionStep
            groups={bookingData.staffAndSlotsData?.groups || []}
            services={bookingData.services || []}
            selectedSlots={selectedSlots}
            onSlotSelect={(groupIdx, slot, staff) => {
              setSelectedSlots(prev => ({ ...prev, [groupIdx]: { slot, staff } }))
            }}
          />
        )
      case 4: {
        // Prepare the same bookingData payload as used for gettotals
        // const bookingDataArr = (bookingData.services || []).map((s: any) => {
        //   const stored = getStoredServices().find((ss: any) => ss.service.id === s.id)
        //   return {
        //     service_id: s.id,
        //     option_ids: stored?.options ? stored.options.map((o: any) => o.id) : undefined
        //   }
        // })
        const bookingDataArr = buildBookingDataArray();

        const getTotalsPayload = {
          name: customerDetails.name,
          email: customerDetails.email,
          number: customerDetails.phone_number || "3001234567",
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
          user_id: getUserIdFromStorage(),
          zone_id: getSelectedZoneId() || undefined,
          bookingData: bookingDataArr
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
            selectedSlots={selectedSlots}
            groups={bookingData.staffAndSlotsData?.groups || []}
          />
        )
      default:
        return null
    }
  }

  // Call gettotals API when moving from details to summary
  const handleCustomerDetailsNext = async () => {
    setIsLoading(true);
    setTotalsError(null);
    const errors = isCustomerDetailsValid();
    if (errors.length > 0) {
      setCustomerValidationErrors(errors);
      setTotalsError(null);
      setIsLoading(false);
      return;
    } else {
      setCustomerValidationErrors([]);
    }
    try {
      // Build bookingData array for payload
      const bookingDataArr = buildBookingDataArray();
      // Prepare payload for /api/gettotals
      const payload = {
        name: customerDetails.name,
        email: customerDetails.email,
        number: customerDetails.phone_number || "3001234567",
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
        user_id: getUserIdFromStorage(),
        zone_id: getSelectedZoneId() || undefined,
        bookingData: bookingDataArr
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gettotals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.error) {
        setTotalsError(typeof data.error === "string" ? data.error : "Unable to calculate totals. Please check your details and try again.");
        return;
      }
      if (!res.ok) throw new Error("Failed to get totals");
      setTotals(data);
      setCurrentStep(5);
    } catch (err) {
      setTotalsError("Unable to calculate totals. Please check your details and try again.");
    } finally {
      setIsLoading(false);
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
      {(customerValidationErrors.length > 0) && (
        <ul className="text-left text-red-600 font-medium mb-2 list-disc list-inside">
          {customerValidationErrors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      )}
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
        ) : currentStep === 3 ? (
          <Button
            onClick={handleSlotStepNext}
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
            disabled={!canProceed() || isLoading}
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
