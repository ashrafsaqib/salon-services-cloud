"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([])
  const [selectedZone, setSelectedZone] = useState<string>("")
  const [loadingZones, setLoadingZones] = useState(false)

  // Fetch zones when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoadingZones(true)
      // Set selected zone from localStorage if exists
      const storedZoneId = localStorage.getItem("selected_zone_id")
      if (storedZoneId) {
        setSelectedZone(storedZoneId)
      } else {
        setSelectedZone("")
      }
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/zones`)
        .then(res => res.json())
        .then(data => setZones(data.zones || []))
        .catch(() => setZones([]))
        .finally(() => setLoadingZones(false))
    }
  }, [isOpen])

  // Handle zone select
  const handleZoneSelect = async (zoneId: string) => {
    setSelectedZone(zoneId)
    const zone = zones.find(z => String(z.id) === zoneId)
    if (zone) {
      localStorage.setItem("selected_zone_id", String(zone.id))
      localStorage.setItem("selected_zone_name", zone.name)
      // Save to backend
      // const token = localStorage.getItem("token")
      // if (token) {
      //   await fetch("/api/savezone", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: JSON.stringify({ zone_id: zone.id, zone_name: zone.name }),
      //   })
      // }
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
          <Select value={selectedZone} onValueChange={handleZoneSelect} disabled={loadingZones}>
            <SelectTrigger>
              <SelectValue placeholder={loadingZones ? "Loading..." : "-- Select Zone --"} />
            </SelectTrigger>
            <SelectContent>
              {zones.map(zone => (
                <SelectItem key={zone.id} value={String(zone.id)}>{zone.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-xs text-gray-500 mt-2">
            <strong>Note:</strong> Changing your location will remove all items from your cart.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
