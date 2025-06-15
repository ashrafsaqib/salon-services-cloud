"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Service } from "@/types"

interface DateSelectionStepProps {
  selectedDate?: string
  service?: Service
  onDateSelect: (date: string) => void
}

export function DateSelectionStep({ selectedDate, service, onDateSelect }: DateSelectionStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availableDates, setAvailableDates] = useState<string[]>([])

  useEffect(() => {
    // Mock available dates (next 30 days excluding some random dates)
    const dates: string[] = []
    const today = new Date()

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip some random dates to simulate unavailability
      if (Math.random() > 0.2) {
        dates.push(date.toISOString().split("T")[0])
      }
    }

    setAvailableDates(dates)
  }, [service])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isDateAvailable = (dateString: string) => {
    return availableDates.includes(dateString)
  }

  const isDateSelected = (dateString: string) => {
    return selectedDate === dateString
  }

  const handleDateClick = (dateString: string) => {
    if (isDateAvailable(dateString)) {
      onDateSelect(dateString)
    }
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const prevMonth = () => {
    const today = new Date()
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    if (newMonth >= new Date(today.getFullYear(), today.getMonth())) {
      setCurrentMonth(newMonth)
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0]

      const isAvailable = isDateAvailable(dateString)
      const isSelected = isDateSelected(dateString)
      const isToday = dateString === new Date().toISOString().split("T")[0]
      const isPast = new Date(dateString) < new Date()

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(dateString)}
          disabled={!isAvailable || isPast}
          className={`h-12 w-full rounded-lg text-sm font-medium transition-colors ${
            isSelected
              ? "bg-rose-600 text-white"
              : isAvailable && !isPast
                ? "hover:bg-rose-100 text-gray-900"
                : "text-gray-400 cursor-not-allowed"
          } ${isToday && !isSelected ? "ring-2 ring-rose-200" : ""}`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Please select a service first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date</h2>
        <p className="text-gray-600">Choose your preferred date for {service.name}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="h-12 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-rose-600 rounded mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 border rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-rose-600 mr-3" />
              <div>
                <p className="font-medium text-rose-900">Selected Date</p>
                <p className="text-sm text-rose-700">{formatDate(selectedDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
