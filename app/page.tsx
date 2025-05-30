"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronRight, ChevronLeft, MapPin, Search, Star, X, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function HomePage() {
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const servicesMenu = {
    "Ladies Salon": [
      "Hair Styling & Cut",
      "Hair Color & Highlights",
      "Facial Treatments",
      "Manicure & Pedicure",
      "Eyebrow & Threading",
      "Makeup Services",
      "Body Massage",
      "Bridal Packages",
    ],
    "Gents Salon": [
      "Haircut & Styling",
      "Beard Trim & Shave",
      "Hair Color",
      "Face Massage",
      "Hair Treatment",
      "Grooming Packages",
    ],
    Automotive: [
      "Car Wash & Detailing",
      "Interior Cleaning",
      "Oil Change",
      "Tire Services",
      "Engine Cleaning",
      "Paint Protection",
      "Maintenance Packages",
    ],
  }

  const allServices = [
    {
      title: "Ladies Salon",
      description: "Professional beauty and wellness services for women",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop",
      popular: true,
    },
    {
      title: "Gents Salon",
      description: "Professional grooming services for men",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop",
      popular: true,
    },
    {
      title: "Automotive",
      description: "Car care and maintenance services",
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop",
      popular: true,
    },
    {
      title: "Spa & Wellness",
      description: "Relaxing spa treatments and wellness services",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
      popular: false,
    },
    {
      title: "Wholesale Services",
      description: "Bulk services for businesses and events",
      image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1000&auto=format&fit=crop",
      popular: false,
    },
    {
      title: "Education & Training",
      description: "Professional courses and certification programs",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop",
      popular: false,
    },
    {
      title: "Home Cleaning",
      description: "Professional house cleaning and maintenance",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop",
      popular: false,
    },
    {
      title: "Pet Grooming",
      description: "Professional grooming services for your pets",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1000&auto=format&fit=crop",
      popular: false,
    },
    {
      title: "Event Services",
      description: "Complete event planning and styling services",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop",
      popular: false,
    },
    {
      title: "Personal Training",
      description: "Fitness coaching and personal training sessions",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
      popular: false,
    },
  ]

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

  const faqs = [
    {
      question: "How do I book a service?",
      answer:
        "You can book a service through our website by selecting your desired service, choosing your location, and picking a convenient time slot. You can also download our mobile app for easier booking on the go.",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We currently serve major metropolitan areas and surrounding suburbs. You can check if we serve your area by entering your address during the booking process or contacting our customer service team.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 24-48 hours in advance to ensure availability. However, we also offer same-day bookings based on staff availability in your area.",
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer:
        "You can cancel or reschedule your appointment up to 4 hours before the scheduled time without any charges. Cancellations within 4 hours may incur a small fee.",
    },
    {
      question: "Are your staff members licensed and insured?",
      answer:
        "Yes, all our professionals are fully licensed, insured, and background-checked. We ensure they meet the highest standards of safety and professionalism.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and digital payment methods including Apple Pay, Google Pay, and PayPal. Payment is processed securely through our platform.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-rose-600">Lipslay Marketplace</h1>
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
                      {Object.entries(servicesMenu).map(([category, services]) => (
                        <div key={category}>
                          <h3 className="font-semibold text-rose-600 mb-3 text-sm uppercase tracking-wide">
                            {category}
                          </h3>
                          <ul className="space-y-2">
                            {services.map((service, index) => (
                              <li key={index}>
                                <a
                                  href="#"
                                  className="text-gray-600 hover:text-rose-600 text-sm block py-1 transition-colors"
                                >
                                  {service}
                                </a>
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

              <a href="#" className="text-gray-600 hover:text-gray-900">
                Packages
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Beauty Add-Ons
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Cart(0)
              </a>

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
                    <a href="#" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                      Sign In
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                      Create Account
                    </a>
                    <div className="border-t my-2"></div>
                    <a href="#" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                      My Bookings
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                      Profile Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                      Payment Methods
                    </a>
                  </div>
                )}
              </div>

              <a href="#" className="text-gray-600 hover:text-gray-900">
                FAQs
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Reviews
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2070&auto=format&fit=crop"
            alt="Professional beauty salon services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Available 24/7 • Book Now
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Beauty & Wellness
              <span className="block bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                At Your Doorstep
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience premium salon services, automotive care, and wellness treatments delivered right to your home.
              Professional quality, unmatched convenience.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-white/70 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-white/70 text-sm">Expert Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-white/70 text-sm">Average Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-0 h-14 px-8 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="mr-2">🎯</span>
                Book Your Service
              </Button>
              <Button className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 h-14 px-8 text-lg font-semibold rounded-full transition-all duration-300">
                <span className="mr-2">🔍</span>
                Browse Services
              </Button>
            </div>

            {/* Service Categories Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { icon: "💇‍♀️", name: "Hair & Beauty" },
                { icon: "🧔‍♂️", name: "Men's Grooming" },
                { icon: "🚗", name: "Auto Care" },
                { icon: "💆‍♀️", name: "Spa & Wellness" },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <div className="text-white text-sm font-medium">{service.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Service Categories - Horizontal Scroll */}
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
                  <Card
                    key={index}
                    className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      {service.popular && (
                        <div className="absolute top-3 left-3 bg-rose-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Popular
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                      <Button variant="outline" className="text-rose-600 border-rose-600 hover:bg-rose-50 w-full">
                        View Services
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button className="bg-rose-600 hover:bg-rose-700">
              View All Services
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Featured Services</h2>
          <Tabs defaultValue="ladies" className="w-full">
            <TabsList className="justify-center">
              <TabsTrigger value="ladies">Ladies Salon</TabsTrigger>
              <TabsTrigger value="gents">Gents Salon</TabsTrigger>
              <TabsTrigger value="auto">Automotive</TabsTrigger>
            </TabsList>
            <TabsContent value="ladies" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Hair Styling",
                    price: "$45",
                    rating: 4.9,
                    image:
                      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Manicure & Pedicure",
                    price: "$35",
                    rating: 4.8,
                    image:
                      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Facial Treatment",
                    price: "$60",
                    rating: 4.7,
                    image:
                      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Full Body Massage",
                    price: "$80",
                    rating: 4.9,
                    image:
                      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1000&auto=format&fit=crop",
                  },
                ].map((service, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-200 relative">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-rose-600">{service.price}</span>
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="gents" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Haircut & Styling",
                    price: "$30",
                    rating: 4.8,
                    image:
                      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Beard Trim",
                    price: "$15",
                    rating: 4.9,
                    image:
                      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Hair Color",
                    price: "$45",
                    rating: 4.7,
                    image:
                      "https://images.unsplash.com/photo-1634302086887-13b5585a8883?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Face Massage",
                    price: "$40",
                    rating: 4.8,
                    image:
                      "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?q=80&w=1000&auto=format&fit=crop",
                  },
                ].map((service, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-200 relative">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-rose-600">{service.price}</span>
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="auto" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Car Wash",
                    price: "$25",
                    rating: 4.7,
                    image:
                      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Oil Change",
                    price: "$40",
                    rating: 4.8,
                    image:
                      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Interior Cleaning",
                    price: "$35",
                    rating: 4.9,
                    image:
                      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop",
                  },
                  {
                    name: "Tire Service",
                    price: "$50",
                    rating: 4.7,
                    image:
                      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop",
                  },
                ].map((service, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gray-200 relative">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-rose-600">{service.price}</span>
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <div className="text-center mt-10">
            <Button className="bg-rose-600 hover:bg-rose-700">
              View All Services
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Book your service in just a few simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Choose Service",
                description: "Browse and select from our wide range of services",
              },
              {
                step: 2,
                title: "Set Location",
                description: "Enter your address or select your location on the map",
              },
              {
                step: 3,
                title: "Select Time",
                description: "Choose a convenient date and time for your service",
              },
              {
                step: 4,
                title: "Enjoy Service",
                description: "Our professional will arrive at your doorstep",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-rose-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Professional Staff */}
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
                  <Card key={index} className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-64 bg-gray-200 relative">
                      <Image src={staff.image || "/placeholder.svg"} alt={staff.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{staff.name}</h3>
                      <p className="text-rose-600 font-medium mb-2">{staff.role}</p>
                      <div className="flex items-center justify-center mb-3">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{staff.rating}</span>
                        <span className="text-gray-500 text-sm ml-2">• {staff.experience}</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-1 mb-4">
                        {staff.specialties.map((specialty, idx) => (
                          <span key={idx} className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <Button variant="outline" className="text-rose-600 border-rose-600 hover:bg-rose-50 w-full">
                        Book with {staff.name.split(" ")[0]}
                      </Button>
                    </CardContent>
                  </Card>
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
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Read testimonials from our satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                service: "Ladies Salon",
                comment:
                  "The service was excellent! The stylist was professional and did an amazing job with my hair. Will definitely book again.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
              },
              {
                name: "Michael Brown",
                service: "Gents Salon",
                comment:
                  "Very convenient service. The barber arrived on time and gave me one of the best haircuts I've had. Highly recommended!",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
              },
              {
                name: "Emily Davis",
                service: "Automotive",
                comment:
                  "I was skeptical about mobile car service, but they did a thorough job cleaning my car. It looks brand new now!",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 relative overflow-hidden">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.service}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700">{testimonial.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Promotion */}
      <section className="py-16 bg-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-lg mb-6">
                Get the best experience with our mobile app. Book services, track your appointments, and get exclusive
                offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-rose-600 hover:bg-gray-100">
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
                    className="lucide lucide-apple mr-2"
                  >
                    <path d="M12 20.94c1.5 0 2.75-.48 3.76-1.42 1-1 1.65-2.2 1.65-3.54 0-1.28-.5-2.34-1.5-3.2" />
                    <path d="M12 20.94c-1.5 0-2.75-.48-3.76-1.42-1-1-1.65-2.2-1.65-3.54 0-1.28.5-2.34 1.5-3.2" />
                    <path d="M9 12.24c-.5-.56-.9-1.22-1.2-2-1.5-4 2-8 2-8s.5 2 2 3c1.5 1 4 1 4 1s.5 3-1.5 4c-1.5.8-3.8.2-3.8.2" />
                    <path d="M12 20.94c1.5 0 2.5-.8 2.5-2.3 0-1.4-1-2.7-2.5-2.7-1.5 0-2.5 1.3-2.5 2.7 0 1.5 1 2.3 2.5 2.3Z" />
                  </svg>
                  App Store
                </Button>
                <Button className="bg-white text-rose-600 hover:bg-gray-100">
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
                    className="lucide lucide-play mr-2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative h-80">
              <Image
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop"
                alt="Lipslay Mobile App"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our services and booking process
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Collapsible
                key={index}
                open={openFAQ === index}
                onOpenChange={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="text-left font-semibold text-gray-900">{faq.question}</h3>
                        {openFAQ === index ? (
                          <Minus className="h-5 w-5 text-rose-600 flex-shrink-0" />
                        ) : (
                          <Plus className="h-5 w-5 text-rose-600 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button className="bg-rose-600 hover:bg-rose-700">
              View All FAQs
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">Stay updated with our latest services and exclusive offers</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button className="bg-rose-600 hover:bg-rose-700">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Lipslay Marketplace</h3>
              <p className="text-gray-400 mb-4">
                Your one-stop solution for all beauty, grooming, and automotive services at your doorstep.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Ladies Salon
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Gents Salon
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Automotive
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Packages
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Beauty Add-Ons
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Refund Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-center text-gray-400">
              &copy; {new Date().getFullYear()} Lipslay Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Location Modal */}
      <Dialog>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Set Location
              <Button variant="ghost" size="icon" className="h-6 w-6">
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
                <Input type="text" placeholder="Search" className="pr-8" />
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

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
