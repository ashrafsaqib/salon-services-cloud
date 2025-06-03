"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StaffCard } from "@/components/ui/staff-card"

const staffMembers = [
  {
    name: "Sarah Martinez",
    role: "Senior Hair Stylist",
    experience: "8+ years",
    rating: 4.9,
    specialties: ["Hair Color", "Bridal Styling", "Cuts"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Michael Chen",
    role: "Master Barber",
    experience: "10+ years",
    rating: 4.8,
    specialties: ["Classic Cuts", "Beard Styling", "Hot Towel Shave"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    role: "Beauty Specialist",
    experience: "6+ years",
    rating: 4.9,
    specialties: ["Facials", "Makeup", "Skincare"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "David Thompson",
    role: "Auto Detailing Expert",
    experience: "12+ years",
    rating: 4.7,
    specialties: ["Paint Protection", "Interior Detailing", "Ceramic Coating"],
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  },
]

export function StaffCarousel() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Professional Staff</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our experienced and certified professionals are dedicated to providing you with exceptional service
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById("staff-carousel")
              if (container) {
                container.scrollBy({ left: -320, behavior: "smooth" })
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors border"
            aria-label="Previous staff"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById("staff-carousel")
              if (container) {
                container.scrollBy({ left: 320, behavior: "smooth" })
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors border"
            aria-label="Next staff"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Scrolling Container */}
          <div className="mx-12">
            <div
              id="staff-carousel"
              className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitScrollbar: { display: "none" },
              }}
            >
              {staffMembers.map((staff, index) => (
                <StaffCard key={index} {...staff} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button className="bg-rose-600 hover:bg-rose-700">
            View All Staff
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
