"use client"

import { useState } from "react"
import { LocationModal } from "@/components/location-modal"

export default function HomePageClient() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true)

  return (
    <>
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
    </>
  )
}
