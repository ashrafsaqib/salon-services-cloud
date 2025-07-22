"use client"
import Link from "next/link"
import { MapPin, Star, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/ui/search-bar"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-rose-50 to-pink-100 py-12 sm:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] [background-size:20px_20px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Beauty & Wellness
            <span className="block text-rose-600">At Your Doorstep</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Professional beauty services delivered to your home. Book trusted experts for hair, makeup, skincare, and
            more with just a few taps.
          </p>

          {/* Search Bar */}
          <div className="mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            <SearchBar />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
            <Link href="/book">
              <Button
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              >
                Book Your Service
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-rose-600 text-rose-600 hover:bg-rose-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto bg-transparent"
              >
                Browse Services
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-rose-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-rose-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">4.9</div>
              <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-rose-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">30min</div>
              <div className="text-xs sm:text-sm text-gray-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-rose-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">50+</div>
              <div className="text-xs sm:text-sm text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
