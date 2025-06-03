"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/ui/service-card"

const allServices = [
  {
    title: "Ladies Salon",
    description: "Professional beauty and wellness services for women",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop",
    popular: true,
    href: "/services/ladies-salon",
  },
  {
    title: "Gents Salon",
    description: "Professional grooming services for men",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop",
    popular: true,
    href: "/services/gents-salon",
  },
  {
    title: "Automotive",
    description: "Car care and maintenance services",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop",
    popular: true,
    href: "/services/automotive",
  },
  {
    title: "Spa & Wellness",
    description: "Relaxing spa treatments and wellness services",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
    popular: false,
    href: "/services/spa-wellness",
  },
  {
    title: "Wholesale Services",
    description: "Bulk services for businesses and events",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1000&auto=format&fit=crop",
    popular: false,
    href: "/services/wholesale",
  },
  {
    title: "Education & Training",
    description: "Professional courses and certification programs",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop",
    popular: false,
    href: "/services/education",
  },
]

export function ServicesCarousel() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of professional services delivered right to your doorstep
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById("services-carousel")
              if (container) {
                container.scrollBy({ left: -320, behavior: "smooth" })
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors border"
            aria-label="Previous services"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById("services-carousel")
              if (container) {
                container.scrollBy({ left: 320, behavior: "smooth" })
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors border"
            aria-label="Next services"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Scrolling Container */}
          <div className="mx-12">
            <div
              id="services-carousel"
              className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitScrollbar: { display: "none" },
              }}
            >
              {allServices.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/services">
            <Button className="bg-rose-600 hover:bg-rose-700">
              View All Services
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
