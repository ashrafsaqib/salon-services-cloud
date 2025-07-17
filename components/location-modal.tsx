"use client"

import React, { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Select from "react-select"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([])
  const [selectedZone, setSelectedZone] = useState<{ value: string; label: string } | null>(null)
  const [loadingZones, setLoadingZones] = useState(false)
  const zoneOptions = zones.map(zone => ({ value: String(zone.id), label: zone.name }))

  // Fetch zones when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoadingZones(true)
      // Set selected zone from localStorage if exists
      const storedZoneId = localStorage.getItem("selected_zone_id")
      const storedZoneName = localStorage.getItem("selected_zone_name")
      if (storedZoneId && storedZoneName) {
        setSelectedZone({ value: storedZoneId, label: storedZoneName })
      } else {
        setSelectedZone(null)
      }
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/zones`)
        .then(res => res.json())
        .then(data => setZones(data.zones || []))
        .catch(() => setZones([]))
        .finally(() => setLoadingZones(false))
    }
  }, [isOpen])

  // No need for search input focus logic with react-select

  // Handle zone select
  const handleZoneSelect = (option: { value: string; label: string } | null) => {
    setSelectedZone(option)
    if (option) {
      localStorage.setItem("selected_zone_id", option.value)
      localStorage.setItem("selected_zone_name", option.label)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Set Location
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            options={zoneOptions}
            value={selectedZone}
            onChange={handleZoneSelect}
            isLoading={loadingZones}
            isClearable
            placeholder={loadingZones ? "Loading..." : "-- Select Zone --"}
            noOptionsMessage={() => "No zones found"}
            classNamePrefix="react-select"
          />
          <div className="text-xs text-gray-500 mt-2">
            <strong>Note:</strong> Changing your location will remove all items from your cart.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
