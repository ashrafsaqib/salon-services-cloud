"use client"

import { useState } from "react"
import { MapPin, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const [searchAddress, setSearchAddress] = useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Set Location
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="-- Select Zone --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zone1">Zone 1</SelectItem>
                <SelectItem value="zone2">Zone 2</SelectItem>
                <SelectItem value="zone3">Zone 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-center text-sm text-gray-500">OR Add Address</div>

          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="pr-8"
              />
              {searchAddress && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchAddress("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">OR Click Map</div>

          <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Click to select location on map</p>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onClose}>
            Save Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
