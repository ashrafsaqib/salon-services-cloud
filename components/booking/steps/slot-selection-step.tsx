"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SlotSelectionStepProps {
  slots: any[]
  selectedSlot: any
  onSlotSelect: (slot: any, staff: any) => void
}

export function SlotSelectionStep({ slots, selectedSlot, onSlotSelect }: SlotSelectionStepProps) {
  // Extract unique staff for legend
  const staffMap = new Map()
  slots.forEach(slot => {
    (slot.staff || []).forEach((staff: any) => {
      if (staff && staff.id) staffMap.set(staff.id, staff)
    })
  })
  const uniqueStaff = Array.from(staffMap.values())

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Time Slot</h2>
        <p className="text-gray-600">Choose your preferred time and professional</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot: any) => (
              (slot.staff || []).map((staff: any) => (
                <Button
                  key={slot.id + "-" + staff.id}
                  variant={selectedSlot?.id === slot.id && selectedSlot?.staffId === staff.id ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => onSlotSelect(slot, staff)}
                  className={`p-0 h-auto rounded-xl shadow-sm border transition-all flex-col items-stretch text-left overflow-hidden ${
                    selectedSlot?.id === slot.id && selectedSlot?.staffId === staff.id
                      ? "ring-2 ring-rose-500 bg-rose-50"
                      : slot.available
                        ? "hover:bg-rose-50 hover:border-rose-300"
                        : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b">
                    <Image
                      src={staff.image || "/placeholder-user.jpg"}
                      alt={staff.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-base">{staff.name}</div>
                      {staff.sub_title && <div className="text-xs text-gray-500">{staff.sub_title}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center px-4 py-5">
                    <div className="font-bold text-xl text-gray-900 mb-1">{slot.time_start}</div>
                    <div className="text-xs text-gray-500 mb-1">{slot.seatAvailable > 1 ? `${slot.seatAvailable} seats` : "1 seat"}</div>
                    {selectedSlot?.id === slot.id && selectedSlot?.staffId === staff.id && (
                      <div className="mt-2 text-xs text-rose-600 font-semibold">Selected</div>
                    )}
                  </div>
                </Button>
              ))
            ))}
          </div>
          {/* Staff legend */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t text-sm">
            <span className="font-semibold">Professionals:</span>
            {uniqueStaff.map((staff: any) => (
              <div key={staff.id} className="flex items-center gap-2">
                <Image
                  src={staff.image || "/placeholder-user.jpg"}
                  alt={staff.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <span>{staff.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
