"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/ui/category-card"
import type { Category } from "@/types"

interface CategoryCarouselProps {
  services: Category[]
}

export function CategoryCarousel({ services }: CategoryCarouselProps) {
  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("services-carousel")
    if (container) {
      const firstCard = container.querySelector(".category-card-wrapper") as HTMLElement
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth
        const gap = 24 // gap-6 = 24px
        const scrollAmount = cardWidth + gap
        container.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }

  if (!services || services.length === 0) return null

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
          {/* Left Arrow - Hidden on mobile when not needed */}
          <button
            onClick={() => scrollContainer("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors border hidden sm:block"
            aria-label="Previous services"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Right Arrow - Hidden on mobile when not needed */}
          <button
            onClick={() => scrollContainer("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 transition-colors border hidden sm:block"
            aria-label="Next services"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Scrolling Container */}
          <div className="sm:mx-12">
            <div
              id="services-carousel"
              className={`flex overflow-x-auto scrollbar-hide gap-6 pb-4 scroll-smooth ${
                services.length === 1 ? "justify-center" : "justify-start"
              }`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {services.map((service, index) => (
                <div key={index} className="category-card-wrapper flex-shrink-0">
                  <CategoryCard cat={service} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/category">
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
