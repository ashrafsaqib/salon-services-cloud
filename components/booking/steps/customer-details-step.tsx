"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { CustomerInfo } from "@/types"
import { getUserIdFromStorage, getSelectedZoneId } from "@/lib/storage"
import PhoneInputWithCountry from "@/components/ui/phone-input-with-country"

interface CustomerDetailsStepProps {
  customerDetails: CustomerInfo
  onUpdate: (details: CustomerInfo) => void
  onApplyCoupon: (code: string) => void
  areaOptions: string[]
  onNext: () => void
  onBack: () => void
  bookingData: any // Add bookingData prop
  userId?: string | null // Add userId prop
}

export function CustomerDetailsStep({
  customerDetails,
  onUpdate,
  onApplyCoupon,
  areaOptions,
  onNext,
  onBack,
  bookingData,
  userId = null,
}: CustomerDetailsStepProps) {
  const [couponInput, setCouponInput] = useState("")
  const [couponError, setCouponError] = useState("")
  const [zoneName, setZoneName] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [showAreaMsg, setShowAreaMsg] = useState(false);

  useEffect(() => {
    // Only fill if save_data is true or you want to always check
    const name = localStorage.getItem("user_name")
    const email = localStorage.getItem("user_email")
    const gender = localStorage.getItem("user_gender")
    const phone_number = localStorage.getItem("user_number")
    const whatsapp_number = localStorage.getItem("user_whatsapp")
    const selectedZoneName = localStorage.getItem("selected_zone_name") || "";
    setZoneName(selectedZoneName);


    // If any data exists, update the form
    if (name || email || gender || phone_number || whatsapp_number) {
      onUpdate({
        ...customerDetails,
        name: name || customerDetails.name,
        email: email || customerDetails.email,
        gender: gender || customerDetails.gender,
        phone_number: phone_number || customerDetails.phone_number,
        whatsapp_number: whatsapp_number || customerDetails.whatsapp_number,
      })
    }

    // Check for token before fetching addresses
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    if (!token) {
      setShowAddressForm(true);
      setAddresses([]);
      return;
    }
    // Fetch addresses from API with token
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const filtered = (data || []).filter((a: any) => a.area === selectedZoneName);
        setAddresses(filtered);
        if (filtered.length > 0) {
          setShowAddressForm(false);
        }
      });
  }, []) // Run only once on mount

  const handleChange = (field: keyof CustomerInfo, value: string | boolean) => {
    if (field === "coupon_code") {
      setCouponInput(value as string) // Update local coupon input state
    }
    onUpdate({ ...customerDetails, [field]: value })
  }
  // TODO cleanup payload for apply coupon
  const handleApplyCoupon = async () => {
    const code = (couponInput || customerDetails.coupon_code || "").trim();
    if (!code) return;
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon_code: code,
          bookingData,
          user_id: userId || getUserIdFromStorage(),
          zone_id: getSelectedZoneId() || undefined,
        })
      });
      if (res.status === 200) {
        setCouponError("");
        onApplyCoupon(code);
      } else {

        setCouponError("Invalid coupon code");
        if (typeof window !== 'undefined') {
          localStorage.removeItem('applied_coupon');
        }
      }
    } catch {
      setCouponError("Invalid coupon code");
      if (typeof window !== 'undefined') {
        localStorage.removeItem('applied_coupon');
      }
    }
  }

  // Validation for required fields
  const isFormValid = () => {
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

  // Show error if not valid
  const [showError, setShowError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      setShowError(false)
      onApplyCoupon(couponInput) // Ensure coupon is always sent to parent
    } else {
      setShowError(true)
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
        <p className="text-gray-600">Please provide your personal and address information</p>
      </div>
      {/* Address Section */}
      <div className="bg-gray-50 rounded-lg p-4 border space-y-4">
        <h3 className="text-lg font-semibold mb-2">Address Information</h3>
        {addresses.length > 0 && !showAddressForm ? (
          <div className="space-y-2">
            {addresses.map(addr => (
              <label key={addr.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => {
                    setSelectedAddressId(addr.id);
                    onUpdate({
                      ...customerDetails,
                      building_name: addr.buildingName,
                      flat_or_villa: addr.flatVilla,
                      street: addr.street,
                      area: addr.area,
                      district: addr.district,
                      landmark: addr.landmark,
                      city: addr.city,
                      selected_address_id: addr.id,
                    });
                  }}
                />
                {`${addr.buildingName}, ${addr.flatVilla}, ${addr.street}, ${addr.landmark}, ${addr.area}, ${addr.city}, ${addr.district}`}
              </label>
            ))}
            <Button type="button" onClick={() => {
              setShowAddressForm(true);
              setSelectedAddressId(null);
              onUpdate({
                ...customerDetails,
                building_name: "",
                flat_or_villa: "",
                street: "",
                district: "",
                landmark: "",
                city: "",
                area: zoneName,
                selected_address_id: null,
              });
            }}>New Address</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Building Name *</Label>
              <Input value={customerDetails.building_name} onChange={e => handleChange("building_name", e.target.value)} required />
            </div>
            <div>
              <Label>Flat / Villa *</Label>
              <Input value={customerDetails.flat_or_villa} onChange={e => handleChange("flat_or_villa", e.target.value)} required />
            </div>
            <div>
              <Label>Street *</Label>
              <Input value={customerDetails.street} onChange={e => handleChange("street", e.target.value)} required />
            </div>
            <div>
              <Label>Area *</Label>
              <Input
                value={zoneName}
                readOnly
                tabIndex={0}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#f3f4f6',
                  color: '#9ca3af',
                  pointerEvents: 'auto',
                  opacity: 1
                }}
                aria-disabled="true"
                onClick={() => setShowAreaMsg(true)}
                onBlur={() => setShowAreaMsg(false)}
              />
              {showAreaMsg && (
                <div className="text-xs text-rose-500 mt-1">To change Area, click on the header location button.</div>
              )}
            </div>
            <div>
              <Label>District *</Label>
              <Input value={customerDetails.district} onChange={e => handleChange("district", e.target.value)} required />
            </div>
            <div>
              <Label>Landmark *</Label>
              <Input value={customerDetails.landmark} onChange={e => handleChange("landmark", e.target.value)} required />
            </div>
            <div>
              <Label>City *</Label>
              <Input value={customerDetails.city} onChange={e => handleChange("city", e.target.value)} required />
            </div>
            <div>
              <Label>Custom Location</Label>
              <Input value={`${customerDetails.latitude || ""}, ${customerDetails.longitude || ""}`} readOnly />
            </div>
          </div>
        )}
      </div>
      {/* Personal Info Section */}
      <div className="bg-gray-50 rounded-lg p-4 border space-y-4">
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name *</Label>
            <Input value={customerDetails.name} onChange={e => handleChange("name", e.target.value)} required />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={customerDetails.email} onChange={e => handleChange("email", e.target.value)} required />
          </div>
          <div>
            <Label>Phone Number *</Label>
            <PhoneInputWithCountry
              value={customerDetails.phone_number || ""}
              onChange={(value: string) => handleChange("phone_number", value.startsWith('+') ? value : `+${value}`)}
            />
          </div>
          <div>
            <Label>WhatsApp Number *</Label>
            <PhoneInputWithCountry
              value={customerDetails.whatsapp_number || ""}
              onChange={(value: string) => handleChange("whatsapp_number", value.startsWith('+') ? value : `+${value}`)}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Gender *</Label>
            <div className="flex gap-4 mt-2">
              <label><input type="radio" name="gender" value="Male" checked={customerDetails.gender === "Male"} onChange={() => handleChange("gender", "Male")} required /> Male</label>
              <label><input type="radio" name="gender" value="Female" checked={customerDetails.gender === "Female"} onChange={() => handleChange("gender", "Female")} required /> Female</label>
            </div>
          </div>
          <div>
            <Label>Affiliate Code</Label>
            <Input value={customerDetails.affiliate_code || ""} onChange={e => handleChange("affiliate_code", e.target.value)} />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Coupon Code</Label>
              <Input value={customerDetails.coupon_code} onChange={e => handleChange("coupon_code", e.target.value)} />
              {couponError && (
                <div className="text-red-500 text-xs mt-1">{couponError}</div>
              )}
            </div>
            <Button type="button" onClick={handleApplyCoupon}>Apply Coupon</Button>
          </div>
          {hasToken && (
            <div className="flex items-center mt-2 md:col-span-2">
              <Checkbox checked={customerDetails.save_data} onCheckedChange={v => handleChange("save_data", !!v)} />
              <Label className="ml-2">Save Data in Profile</Label>
            </div>
          )}
        </div>
      </div>
      {showError && (
        <div className="text-red-600 text-sm font-medium">Please fill all required fields before continuing.</div>
      )}
    </form>
  )
}
