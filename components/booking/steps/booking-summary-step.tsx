"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, User, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { Service, StaffMember, CustomerInfo, BookingData } from "@/types";

interface BookingSummaryStepProps {
  bookingData: BookingData;
  onCustomerInfoUpdate: (customerInfo: CustomerInfo) => void;
  onEditDetails: () => void;
  onConfirmBooking: () => void;
  isLoading: boolean;
  totals?: any; // API totals response
  selectedSlots?: { [groupIdx: number]: { slot: any; staff: any } };
  groups?: any[];
}

export function BookingSummaryStep({
  bookingData,
  onCustomerInfoUpdate,
  onEditDetails,
  onConfirmBooking,
  isLoading,
  totals,
  selectedSlots = {},
  groups = [],
}: BookingSummaryStepProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(
    bookingData.customerInfo || {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    }
  );

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    const updatedInfo = { ...customerInfo, [field]: value };
    setCustomerInfo(updatedInfo);
    onCustomerInfoUpdate(updatedInfo);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate total for multiple services
  const calculateTotal = () => {
    if (!bookingData.services || bookingData.services.length === 0)
      return { subtotal: 0, tax: 0, total: 0 };
    const basePrice = bookingData.services.reduce(
      (sum, s) => sum + (parseFloat(s.price.replace("$", "")) || 0),
      0
    );
    const staffModifier = bookingData.staff?.priceModifier || 0;
    const subtotal = basePrice + staffModifier;
    const tax = Math.round(subtotal * 0.08); // 8% tax

    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  };

  const pricing = calculateTotal() || { subtotal: 0, tax: 0, total: 0 };

  const isFormValid = () => {
    return (
      customerInfo.name &&
      customerInfo.email &&
      customerInfo.phone &&
      customerInfo.address
    );
  };

  if (
    !bookingData.services ||
    bookingData.services.length === 0 ||
    !bookingData.date ||
    !bookingData.timeSlot ||
    !bookingData.staff
  ) {
    return (
      <div className="text-center py-8">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Please complete all previous steps</p>
      </div>
    );
  }

  // Fix: type for customer info to avoid property errors
  const customer = (bookingData.customerInfo || {}) as {
    name?: string;
    email?: string;
    phone_number?: string;
    whatsapp_number?: string;
    gender?: string;
    affiliate_code?: string;
    coupon_code?: string;
    save_data?: boolean;
    building_name?: string;
    flat_or_villa?: string;
    street?: string;
    area?: string;
    district?: string;
    landmark?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Book</h2>
        <p className="text-gray-600">Review your booking details and confirm</p>
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
            {/* Simple & sexy multi-group summary */}
            {groups.length > 0 &&
              Object.entries(selectedSlots).map(([groupIdx, sel]) => {
                const group = groups[Number(groupIdx)];
                if (!group) return null;
                const selTyped = sel as { slot: any; staff: any };
                return (
                  <div
                    key={groupIdx}
                    className="rounded-xl bg-gradient-to-br from-rose-50 to-white shadow p-4 mb-4 border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-base text-rose-600">
                        Service {parseInt(groupIdx) + 1}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {(group.services || []).map((sid: number) => {
                        const service = (bookingData.services || []).find(
                          (s: any) => s.id === sid
                        );
                        if (!service) return null;
                        return (
                          <div
                            key={service.id}
                            className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 shadow-sm border border-rose-100"
                          >
                            <Image
                              src={service.image || "/placeholder.svg"}
                              alt={service.name}
                              width={28}
                              height={28}
                              className="object-cover rounded border border-gray-200"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              {service.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1 text-sm">
                        <User className="h-4 w-4 text-green-500" />
                        {selTyped.staff ? (
                          selTyped.staff.name
                        ) : (
                          <span className="text-gray-400">No staff</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1 text-sm">
                        <Clock className="h-4 w-4 text-rose-500" />
                        {selTyped.slot ? (
                          selTyped.slot.time_start ||
                          selTyped.slot.label ||
                          selTyped.slot.time ||
                          selTyped.slot.id
                        ) : (
                          <span className="text-gray-400">No slot</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            <Separator />

            {/* Date & Time */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium">
                  {formatDate(bookingData.date)}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">At your location</span>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              {totals &&
              typeof totals === "object" &&
              !Array.isArray(totals) &&
              Object.keys(totals).length > 0 ? (
                <>
                  {Object.entries(totals).map(([label, value]) => (
                    <div
                      key={label}
                      className={`flex justify-between ${
                        label.toLowerCase().includes("total")
                          ? "font-semibold text-lg"
                          : "text-sm"
                      }`}
                    >
                      <span>{label}</span>
                      <span
                        className={
                          label.toLowerCase().includes("total")
                            ? "text-rose-600"
                            : undefined
                        }
                      >
                        {typeof value === "number"
                          ? `AED ${value}`
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                // fallback to old pricing if no totals
                <>
                  {bookingData.services.map((service) => (
                    <div className="flex justify-between" key={service.id}>
                      <span>{service.name}</span>
                      <span>{service.price}</span>
                    </div>
                  ))}
                  {bookingData.staff?.priceModifier &&
                    bookingData.staff.priceModifier > 0 && (
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
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Information (read-only, with edit button) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                <User className="h-5 w-5 mr-2 inline" />
                Your Information
              </span>
              <Button size="sm" variant="outline" onClick={onEditDetails}>
                Edit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <b>Name:</b> {customer.name}
            </div>
            <div>
              <b>Email:</b> {customer.email}
            </div>
            <div>
              <b>Phone Number:</b> {customer.phone_number}
            </div>
            <div>
              <b>WhatsApp Number:</b> {customer.whatsapp_number}
            </div>
            <div>
              <b>Gender:</b> {customer.gender}
            </div>
            <div>
              <b>Affiliate Code:</b> {customer.affiliate_code}
            </div>
            <div>
              <b>Coupon Code:</b> {customer.coupon_code}
            </div>
            <div>
              <b>Save Data in Profile:</b> {customer.save_data ? "Yes" : "No"}
            </div>
            <Separator />
            <div>
              <b>Building Name:</b> {customer.building_name}
            </div>
            <div>
              <b>Flat / Villa:</b> {customer.flat_or_villa}
            </div>
            <div>
              <b>Street:</b> {customer.street}
            </div>
            <div>
              <b>Area:</b> {customer.area}
            </div>
            <div>
              <b>District:</b> {customer.district}
            </div>
            <div>
              <b>Landmark:</b> {customer.landmark}
            </div>
            <div>
              <b>City:</b> {customer.city}
            </div>
            <div>
              <b>Custom Location:</b> {customer.latitude}, {customer.longitude}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="pt-4">
        <Button
          onClick={onConfirmBooking}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Booking...
            </div>
          ) : totals &&
            typeof totals === "object" &&
            !Array.isArray(totals) &&
            Object.keys(totals).length > 0 &&
            totals["Total"] ? (
            `Confirm Booking - AED ${totals["Total"]}`
          ) : (
            `Confirm Booking - $${pricing.total}`
          )}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          By confirming this booking, you agree to our Terms of Service and
          Privacy Policy. You will be redirected to secure payment processing.
        </p>
      </div>
    </div>
  );
}
