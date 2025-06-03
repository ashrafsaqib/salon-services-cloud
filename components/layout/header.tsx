"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const servicesMenu = {
    "Ladies Salon": {
      category: "ladies-salon",
      services: [
        { name: "Hair Styling & Cut", slug: "hair-styling-cut" },
        { name: "Hair Color & Highlights", slug: "hair-color-highlights" },
        { name: "Facial Treatments", slug: "facial-treatment" },
        { name: "Manicure & Pedicure", slug: "manicure-pedicure" },
        { name: "Eyebrow & Threading", slug: "eyebrow-threading" },
        { name: "Makeup Services", slug: "makeup-services" },
        { name: "Body Massage", slug: "body-massage" },
        { name: "Bridal Packages", slug: "bridal-packages" },
      ],
    },
    "Gents Salon": {
      category: "gents-salon",
      services: [
        { name: "Haircut & Styling", slug: "haircut-styling" },
        { name: "Beard Trim & Shave", slug: "beard-trim-shave" },
        { name: "Hair Color", slug: "hair-color" },
        { name: "Face Massage", slug: "face-massage" },
        { name: "Hair Treatment", slug: "hair-treatment" },
        { name: "Grooming Packages", slug: "grooming-packages" },
      ],
    },
    Automotive: {
      category: "automotive",
      services: [
        { name: "Car Wash & Detailing", slug: "car-wash-detailing" },
        { name: "Interior Cleaning", slug: "interior-cleaning" },
        { name: "Oil Change", slug: "oil-change" },
        { name: "Tire Services", slug: "tire-services" },
        { name: "Engine Cleaning", slug: "engine-cleaning" },
        { name: "Paint Protection", slug: "paint-protection" },
        { name: "Maintenance Packages", slug: "maintenance-packages" },
      ],
    },
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Lipslay Marketplace" width={180} height={40} className="h-8 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <div
              className="relative"
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
            >
              <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer py-2">
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {/* Services Mega Menu */}
              {isServicesMenuOpen && (
                <div className="absolute top-full left-0 w-[600px] bg-white shadow-lg border rounded-lg mt-1 p-6 z-50">
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(servicesMenu).map(([categoryName, categoryData]) => (
                      <div key={categoryName}>
                        <Link href={`/services/${categoryData.category}`}>
                          <h3 className="font-semibold text-rose-600 mb-3 text-sm uppercase tracking-wide hover:text-rose-700 cursor-pointer">
                            {categoryName}
                          </h3>
                        </Link>
                        <ul className="space-y-2">
                          {categoryData.services.map((service, index) => (
                            <li key={index}>
                              <Link
                                href={`/services/${categoryData.category}/${service.slug}`}
                                className="text-gray-600 hover:text-rose-600 text-sm block py-1 transition-colors"
                              >
                                {service.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-6 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">Need help choosing?</h4>
                        <p className="text-sm text-gray-600">Our experts can help you find the perfect service</p>
                      </div>
                      <Button className="bg-rose-600 hover:bg-rose-700">Get Consultation</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/packages" className="text-gray-600 hover:text-gray-900">
              Packages
            </Link>
            <Link href="/add-ons" className="text-gray-600 hover:text-gray-900">
              Beauty Add-Ons
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              Cart(0)
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsAccountMenuOpen(true)}
              onMouseLeave={() => setIsAccountMenuOpen(false)}
            >
              <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer py-2">
                <span>Account</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {/* Account Menu */}
              {isAccountMenuOpen && (
                <div className="absolute top-full right-0 w-48 bg-white shadow-lg border rounded-lg mt-1 py-2 z-50">
                  <Link href="/signin" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                    Sign In
                  </Link>
                  <Link href="/signup" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                    Create Account
                  </Link>
                  <div className="border-t my-2"></div>
                  <Link href="/bookings" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                    My Bookings
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                    Profile Settings
                  </Link>
                  <Link href="/payment" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                    Payment Methods
                  </Link>
                </div>
              )}
            </div>

            <Link href="/faq" className="text-gray-600 hover:text-gray-900">
              FAQs
            </Link>

            {/* Book Button - Replaced Reviews */}
            <Link href="/book">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                Book Now
              </Button>
            </Link>

            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          <Button variant="ghost" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}
