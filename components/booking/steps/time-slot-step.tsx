"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Service {
  id: number
  name: string
  category: string
  categorySlug: string
  serviceSlug: string
  price: string
  duration: string
  description: string
  image: string
  keywords: string[]
}

interface TimeSlotStepProps {
  selectedTimeSlot?: string
  selectedDate?: string
  service?: Service
  onTimeSlotSelect: (timeSlot: string) => void
}

interface TimeSlot {
  time: string
  available: boolean
  popular?: boolean
}

export function TimeSlotStep({ selectedTimeSlot, selectedDate, service, onTimeSlotSelect }: TimeSlotStepProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    if (selectedDate && service) {
      // Mock time slots based on service duration
      const duration = Number.parseInt(service.duration.replace(" min", ""))
      const slots: TimeSlot[] = []

      // Generate slots from 9 AM to 6 PM
      for (let hour = 9; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += duration) {
          if (hour === 18 && minute > 0) break // Don't go past 6 PM

          const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
          const available = Math.random() > 0.3 // 70% availability
          const popular = Math.random() > 0.8 // 20% popular slots

          slots.push({ time, available, popular })
        }
      }

      setTimeSlots(slots)
    }
  }, [selectedDate, service])

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":")
    const hourNum = Number.parseInt(hour)
    const ampm = hourNum >= 12 ? "PM" : "AM"
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  const handleTimeSlotSelect = (time: string) => {
    onTimeSlotSelect(time)
  }

  if (!service || !selectedDate) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Please select a service and date first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Time Slot</h2>
        <p className="text-gray-600">
          Choose your preferred time for {service.name} on{" "}
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                disabled={!slot.available}
                onClick={() => handleTimeSlotSelect(slot.time)}
                className={`h-12 relative ${
                  selectedTimeSlot === slot.time
                    ? "bg-rose-600 hover:bg-rose-700"
                    : slot.available
                      ? "hover:bg-rose-50 hover:border-rose-300"
                      : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{formatTime(slot.time)}</div>
                  {slot.popular && slot.available && <div className="text-xs text-rose-600 font-medium">Popular</div>}
                </div>
                {slot.popular && slot.available && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                )}
              </Button>
            ))}
          </div>

          {timeSlots.filter((slot) => slot.available).length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No available slots</h3>
              <p className="text-gray-600">Please try a different date</p>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm mt-6 pt-6 border-t">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-rose-600 rounded mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
              <span>Popular</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTimeSlot && (
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-rose-600 mr-3" />
              <div>
                <p className="font-medium text-rose-900">Selected Time</p>
                <p className="text-sm text-rose-700">
                  {formatTime(selectedTimeSlot)} ({service.duration})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
