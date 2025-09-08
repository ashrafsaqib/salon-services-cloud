"use client"

import React, { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin, ChevronRight, Info, SlidersHorizontal} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "@/components/layout/layout"
import { StaffCard } from "@/components/ui/staff-card"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { QuoteRequestModal } from "@/components/quote/QuoteRequestModal"
import Script from "next/script"
import Loading from "@/app/loading"
import ReviewAddModal from "@/components/review-add-modal"
import { shouldUseCache } from "@/utils/cacheUtils"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ServiceDetailPageProps {
  params: Promise<{
    service: string
  }>
}

export default function ClientPage({ params }: ServiceDetailPageProps) {
  const { service } = use(params)
  const [serviceData, setServiceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<any[]>([])
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([])
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [additionalImage, setAdditionalImage] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'))
    }
  }, [])

  const handleReviewSubmit = async (formData: FormData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 200) {
        sessionStorage.setItem("flashMessage", data?.message || "Your review was submitted successfully.")
        setShowReviewModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        alert(data?.message || "Failed to submit review.")
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review.")
    }
  }
  const router = useRouter()

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true)
      setError(false)
      try {
        let zoneId = ''
        if (typeof window !== 'undefined') {
          zoneId = localStorage.getItem('selected_zone_id') || ''
        }
        let data = null
        if (shouldUseCache() == true) {
          try {
            const jsonFileName = zoneId ? `${service}_${zoneId}.json` : `${service}.json`
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dayTimestamp = today.getTime();
            const localRes = await fetch(`https://partner.lipslay.com/jsonCache/services/${jsonFileName}?ts=${dayTimestamp}`)
            if (!localRes.ok) throw new Error('Not found')
            data = await localRes.json()
          } catch {
            // fallback to API below
          }
        }
        if (!data) {
          const apiRes = await fetch(
            `${API_BASE_URL}/api/service?query=${encodeURIComponent(`${service}`)}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`
          )
          if (!apiRes.ok) throw new Error("Service not found")
          data = await apiRes.json()
        }
        if (!data) throw new Error("No data")
        setServiceData(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [service])

  if (loading) {
    return <Loading />
  }

  if (error || !serviceData) {
    notFound()
  }

  // Utility for localStorage key (should match booking wizard)
  const BOOKING_SERVICES_KEY = "booking_selected_services"

  function getStoredServices() {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(BOOKING_SERVICES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }
  function setStoredServices(services: any[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(BOOKING_SERVICES_KEY, JSON.stringify(services))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Script src="https://static.addtoany.com/menu/page.js" strategy="afterInteractive" />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/category" className="hover:text-gray-900">
              Services
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 font-medium">{serviceData.name}</span>
          </div>
        </div>
      </div>

      {/* Service Hero */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Service Info Section - now 1/3 width */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(serviceData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {serviceData.rating} ({serviceData.reviews.length} reviews)
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{serviceData.name}</h1>
              <div className="text-lg text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: serviceData.description }} />

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{serviceData.duration}</span>
                </div>
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span>At your location</span>
                </div>
                <div className="flex items-center bg-rose-100 px-4 py-2 rounded-full text-rose-700">
                  {serviceData.discount ? (
                    <>
                      <span className="font-semibold text-gray-400 line-through mr-2">{serviceData.price}</span>
                      <span className="font-semibold text-rose-700">{serviceData.discount}</span>
                    </>
                  ) : (
                    <span className="font-semibold">{serviceData.price}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Image & Gallery Section - now 2/3 width */}
            <div className="md:col-span-2 relative flex flex-col md:flex-row h-auto md:h-[36rem]">
              {/* Main Image */}
              <div className="relative w-full h-64 md:h-[36rem] rounded-lg overflow-hidden">
                <Image
                  src={additionalImage || serviceData.image || "/placeholder.svg"}
                  alt={serviceData.name}
                  fill
                  className="object-cover transition-all duration-200"
                />
              </div>
              {/* Gallery column - moved to right side on desktop, below on mobile */}
              {serviceData.gallery && serviceData.gallery.length > 0 && (
                <div className="flex flex-row md:flex-col items-center md:ml-6 w-full md:w-auto h-32 md:h-[36rem] mt-4 md:mt-0">
                  {/* Scroll Up Button (hidden on mobile) */}
                  <button
                    className="hidden md:block mb-2 p-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 shadow"
                    onClick={() => {
                      const el = document.getElementById("gallery-scroll");
                      if (el) el.scrollBy({ top: -80, behavior: "smooth" });
                    }}
                    aria-label="Scroll Up"
                  >
                    ▲
                  </button>
                  {/* Gallery Images */}
                  <div
                    id="gallery-scroll"
                    className="flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-y-auto h-full md:h-[calc(100%-48px)] scrollbar-hide"
                  >
                    {[
                      serviceData.image, // Main image first
                      ...serviceData.gallery.filter((img: string) => img !== serviceData.image)
                    ].map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 cursor-pointer transition-all hover:border-2 hover:border-rose-500"
                        onClick={() => setAdditionalImage(img)}
                        style={{ background: "#fff" }}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Scroll Down Button (hidden on mobile) */}
                  <button
                    className="hidden md:block mt-2 p-1 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 shadow"
                    onClick={() => {
                      const el = document.getElementById("gallery-scroll");
                      if (el) el.scrollBy({ top: 80, behavior: "smooth" });
                    }}
                    aria-label="Scroll Down"
                  >
                    ▼
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="details">
              <TabsList
                className="w-full flex overflow-x-auto gap-2 scrollbar-hide px-1 justify-start md:grid md:grid-cols-5 md:gap-0 md:overflow-x-visible"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <TabsTrigger value="details" className="min-w-[120px] whitespace-nowrap">Details</TabsTrigger>
                <TabsTrigger value="specifications" className="min-w-[120px] whitespace-nowrap">Specifications</TabsTrigger>
                <TabsTrigger value="staff" className="min-w-[120px] whitespace-nowrap">Staff</TabsTrigger>
                <TabsTrigger value="reviews" className="min-w-[120px] whitespace-nowrap">Reviews</TabsTrigger>
                <TabsTrigger value="faq" className="min-w-[120px] whitespace-nowrap">FAQ</TabsTrigger>
              </TabsList>
              {/* Mobile scroll indicator */}
              <div className="md:hidden flex justify-center mt-2 relative">
                <div className="flex items-center gap-1 animate-scroll-x">
                  <span className="inline-block w-6 h-6 text-gray-400 animate-bounce-x">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4l4 4-4 4" />
                    </svg>
                  </span>
                  <span className="text-xs text-gray-400">Swipe to see more</span>
                </div>
                <style jsx>{`
                  @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(12px); }
                  }
                  .animate-bounce-x {
                    animation: bounce-x 1.2s infinite;
                  }
                  @keyframes scroll-x {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                  }
                  .animate-scroll-x {
                    animation: scroll-x 2s infinite;
                  }
                `}</style>
              </div>

            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
                  <div className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: serviceData.longDescription || serviceData.description }} />

                  {/* This Package Includes section */}
                  {serviceData.packages && serviceData.packages.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-3 text-rose-700">This Package Includes</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {serviceData.packages.map((pkg: any) => (
                          <div key={pkg.id} className="flex items-center bg-gray-50 border rounded-lg p-3">
                            <div className="relative h-14 w-14 rounded overflow-hidden flex-shrink-0 mr-4">
                              <Image
                                src={pkg.image || "/placeholder.svg"}
                                alt={pkg.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{pkg.name}</div>
                              <div className="text-sm text-gray-600">{pkg.duration || ""}</div>
                              <div className="text-rose-600 font-semibold">{pkg.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6 relative">
                      <h3 className="text-xl font-semibold mb-6">Book This Service</h3>
                      {hoveredImage && (
                        <div
                          className="absolute top-0 left-[-340px] z-50 flex items-center justify-center"
                          style={{ width: 320, height: 320 }}
                          onMouseEnter={() => {
                            if (hoverTimeout) clearTimeout(hoverTimeout);
                          }}
                          onMouseLeave={() => {
                            setHoveredImage(null);
                          }}
                        >
                          <div className="relative w-full h-full bg-white rounded-lg overflow-hidden border-2 border-rose-400 shadow-2xl animate-fade-in pointer-events-auto">
                            <Image
                              src={hoveredImage}
                              alt="Preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-6">
                        {/* Options Section with Scroll */}
                        {serviceData.options && serviceData.options.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-700">Customize your service</h4>
                              {selectedOptions.length > 0 && (
                                <span className="text-xs text-rose-600 font-medium">
                                  {selectedOptions.length} selected
                                </span>
                              )}
                            </div>
                            
                            <div 
                              className="space-y-3 max-h-[300px] overflow-y-auto pr-2 -mr-2"
                              style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#f43f5e #f9fafb'
                              }}
                            >
                              {serviceData.options.map((option: any) => (
                                <div 
                                  key={option.id} 
                                  className={`relative p-4 rounded-lg transition-all cursor-pointer border 
                                    ${selectedOptions.some(o => o.id === option.id) 
                                      ? 'border-rose-300 bg-rose-50 shadow-sm' 
                                      : 'border-gray-200 hover:border-gray-300'}`}
                                  onClick={() => {
                                    setSelectedOptions(prev => 
                                      prev.some(o => o.id === option.id) 
                                        ? prev.filter(o => o.id !== option.id) 
                                        : [...prev, option]
                                    )
                                  }}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex items-center h-5 mt-0.5">
                                      <input
                                        type="checkbox"
                                        checked={selectedOptions.some(o => o.id === option.id)}
                                        onChange={() => {}}
                                        className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                                      />
                                    </div>
                                    {(option.image && option.image !== "null") && (
                                      <div 
                                        className="relative group h-10 w-10 flex items-center justify-center rounded overflow-hidden flex-shrink-0 mr-2"
                                        onMouseEnter={() => {
                                          if (hoverTimeout) clearTimeout(hoverTimeout);
                                          setHoveredImage(option.image);
                                        }}
                                        onMouseLeave={() => {
                                          // Add a small delay to allow cursor to move to modal
                                          const timeout = setTimeout(() => {
                                            setHoveredImage(null);
                                          }, 200);
                                          setHoverTimeout(timeout);
                                        }}
                                      >
                                        <div className="flex items-center justify-center h-full w-full">
                                          <Image
                                            src={option.image}
                                            alt={option.option_name}
                                            fill
                                            className="object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 truncate">{option.option_name}</div>
                                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                                        {option.option_duration && (
                                          <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                                            <span className="truncate">{option.option_duration}</span>
                                          </span>
                                        )}
                                        {option.option_price && (
                                          <span className="flex items-center gap-1 font-medium text-rose-600">
                                            {option.option_price}
                                          </span>
                                        )}
                                      </div>
                                      {option.option_description && (
                                        <div className="text-sm text-gray-500">
                                          {option.option_description}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sticky Book Button */}
                        <div className="sticky bottom-0 bg-white pt-4 pb-2 -mx-6 px-6 border-t border-gray-100">
                          {serviceData.quote === true ? (
                            <Button
                              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black transition-colors shadow-sm hover:shadow-md"
                              onClick={() => setQuoteModalOpen(true)}
                            >
                              Request a Quote
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white transition-all shadow-sm hover:shadow-md"
                              disabled={serviceData.options?.length > 0 && selectedOptions.length === 0}
                              onClick={() => {
                                if (serviceData?.id) {
                                  const stored = getStoredServices();
                                  const idx = stored.findIndex((s: any) => s.service.id === serviceData.id);
                                  const newEntry = {
                                    service: {
                                      id: serviceData.id,
                                      name: serviceData.name,
                                      image: serviceData.image,
                                      price: serviceData.price,
                                      discount: serviceData.discount,
                                      duration: serviceData.duration,
                                    },
                                    options: selectedOptions.map(o => ({ id: o.id, name: o.option_name })),
                                    addOns: selectedAddOns
                                  };
                                  
                                  const updatedServices = idx > -1 
                                    ? stored.map((s, i) => i === idx ? newEntry : s)
                                    : [...stored, newEntry];
                                    
                                  setStoredServices(updatedServices);
                                  router.push("/book");
                                }
                              }}
                            >
                              {serviceData.options?.length > 0 
                                ? selectedOptions.length > 0 
                                  ? `Book ${selectedOptions.length} Selected Option${selectedOptions.length > 1 ? 's' : ''}` 
                                  : `Select Options to Continue`
                                : `Book Now`}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AddToAny share buttons after Book This Service card */}
                  <div className="mt-6 flex justify-center">
                    <div className="a2a_kit a2a_kit_size_32 a2a_default_style flex gap-3">
                      <a className="a2a_button_whatsapp rounded-full shadow-lg bg-green-500 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center" style={{width: 48, height: 48}}></a>
                      <a className="a2a_button_facebook rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center" style={{width: 48, height: 48}}></a>
                      <a className="a2a_button_twitter rounded-full shadow-lg bg-sky-400 hover:bg-sky-500 transition-colors duration-200 flex items-center justify-center" style={{width: 48, height: 48}}></a>
                      <a className="a2a_button_telegram rounded-full shadow-lg bg-blue-400 hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center" style={{width: 48, height: 48}}></a>
                      <a className="a2a_button_copy_link rounded-full shadow-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center" style={{width: 48, height: 48}}></a>
                    </div>
                  </div>

                  {serviceData.addOns && serviceData.addOns.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">Addons Services</h3>
                      <div className="space-y-4">
                      {serviceData.addOns.map((related: any) => (
                        <div key={related.id} className="flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                          {/* <input
                            type="checkbox"
                            className="mr-3 w-5 h-5 accent-rose-600"
                            checked={selectedAddOns.includes(related.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedAddOns(prev => [...prev, related.id])
                              } else {
                                setSelectedAddOns(prev => prev.filter(id => id !== related.id))
                              }
                            }}
                          /> */}
                          <Link href={`/service/${related.slug}`} className="flex items-center flex-1 min-w-0">
                            <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={related.image || "/placeholder.svg"}
                                alt={related.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4 min-w-0">
                              <h4 className="font-medium truncate">{related.name}</h4>
                              {related.discount ? (
                                <p className="text-rose-600">
                                  <span className="text-gray-400 line-through mr-2">{related.price}</span>
                                  <span>{related.discount}</span>
                                </p>
                              ) : (
                                <p className="text-rose-600">{related.price}</p>
                              )}
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>)}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Attributes / Specifications</h2>
              {serviceData.specification && serviceData.specification.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {serviceData.specification.map((spec: any) => (
                    <div key={spec.id} className="flex items-center bg-white border border-rose-100 rounded-xl p-5 shadow hover:shadow-lg transition-all">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 mr-4">
                        <SlidersHorizontal className="w-7 h-7 text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg mb-1">{spec.title}</div>
                        <div className="text-rose-600 text-base font-bold">{spec.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic">No specifications available.</div>
              )}
            </TabsContent>

            <TabsContent value="staff" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Available Staff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceData.staffMembers.map((staff: any, index: number) => (
                  <StaffCard key={index} {...staff} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
              {isLoggedIn && (
                <div className="mb-6">
                  <button
                    className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Add Your Review
                  </button>
                  <ReviewAddModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={handleReviewSubmit}
                    service_id={serviceData.id}
                  />
                </div>
              )}
              <div className="space-y-6">
                {serviceData.reviews.map((review: any, index: number) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={review.image || "/placeholder.svg"}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium mr-2">{review.name}</h4>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <div className="flex my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        {/* Show review images if present */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {review.images.map((img: string, idx: number) => (
                              <div key={idx} className="relative h-16 w-16 rounded overflow-hidden">
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`review image ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {serviceData.faqs.map((faq: any, index: number) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Info className="h-5 w-5 text-rose-500 mr-2" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 pl-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <QuoteRequestModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        serviceId={serviceData.id}
        serviceName={serviceData.name}
        serviceOptions={serviceData.options || []}
      />

      </Layout>
    </div>
  )
}
