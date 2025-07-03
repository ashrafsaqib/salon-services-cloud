"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Service } from "@/types"

interface DateSelectionStepProps {
  selectedDate?: string
  service?: Service
  onDateSelect: (date: string) => void
  holidays?: string[]
}

export function DateSelectionStep({ selectedDate, service, onDateSelect, holidays: initialHolidays }: DateSelectionStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const holidays = initialHolidays || []

  // Memoized date formatting function
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [])

  // Memoized availability check
  const isDateAvailable = useCallback((dateString: string) => {
    const date = new Date(dateString)
    const isPast = date < new Date(new Date().toDateString())
    const isHoliday = holidays.includes(dateString)
    return !isHoliday && !isPast
  }, [holidays])

  // Navigation handlers
  const nextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }, [])

  const prevMonth = useCallback(() => {
    const today = new Date()
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    if (newMonth >= new Date(today.getFullYear(), today.getMonth())) {
      setCurrentMonth(newMonth)
    }
  }, [currentMonth])

  // Helper to get YYYY-MM-DD in local time
  const toLocalYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Memoized calendar rendering
  const calendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const days = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />)
    }

    // Add day buttons
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day)
      const dateString = toLocalYYYYMMDD(currentDate)
      const isAvailable = !holidays.includes(dateString)
      const isSelected = selectedDate === dateString
      const isToday = dateString === toLocalYYYYMMDD(new Date())

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(dateString)}
          disabled={!isAvailable}
          className={`h-12 w-full rounded-lg text-sm font-medium transition-colors ${
            isAvailable
          ? "hover:bg-rose-100 text-gray-900"
          : "bg-gray-300 text-gray-400 cursor-not-allowed"
          } ${isToday && !isSelected ? "ring-2 ring-rose-200" : ""}`}
        >
          {day}
        </button>
      )
    }
    return days
  }

  // No service selected
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

          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="h-12 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {calendarDays()}
          </div>

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