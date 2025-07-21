"use client"

import React, { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin, ChevronRight, Info } from "lucide-react"
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ServiceDetailPageProps {
  params: Promise<{
    category: string
    service: string
  }>
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { category, service } = use(params)
  const [serviceData, setServiceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<any[]>([])
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([])
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
        let zoneId = '';
        if (typeof window !== 'undefined') {
          zoneId = localStorage.getItem('selected_zone_id') || '';
        }
        const res = await fetch(
          `${API_BASE_URL}/api/service?query=${encodeURIComponent(`${service}`)}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`
        )
        if (!res.ok) throw new Error("Service not found")
        const data = await res.json()
        if (!data) throw new Error("No data")
        setServiceData(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [category, service])

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
            <Link href="/services" className="hover:text-gray-900">
              Services
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href={`/services/${category}`} className="hover:text-gray-900">
              {category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 font-medium">{serviceData.name}</span>
          </div>
        </div>
      </div>

      {/* Service Hero */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
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

            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src={serviceData.image || "/placeholder.svg"}
                alt={serviceData.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

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

                  {/* Service Gallery section, only if images exist */}
                  {serviceData.gallery && serviceData.gallery.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-3">Service Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {serviceData.gallery.map((image: string, index: number) => (
                          <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`${serviceData.name} gallery image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-6">Book This Service</h3>

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

                                  // Add selected add-ons as separate entries
                                  let addOnEntries: any[] = [];
                                  if (serviceData.addOns && Array.isArray(serviceData.addOns) && selectedAddOns.length > 0) {
                                    addOnEntries = serviceData.addOns
                                      .filter((related: any) => selectedAddOns.includes(related.id))
                                      .map((related: any) => ({
                                        service: {
                                          id: related.id,
                                          name: related.name,
                                          image: related.image,
                                          price: related.price,
                                          discount: related.discount,
                                          duration: related.duration,
                                        },
                                        options: [],
                                        addOns: []
                                      }));
                                  }

                                  // Remove any previous entries for these add-ons to avoid duplicates
                                  const addOnIds = addOnEntries.map(e => e.service.id);
                                  let filteredStored = stored.filter((s: any) =>
                                    s.service.id !== serviceData.id && !addOnIds.includes(s.service.id)
                                  );

                                  // Add/replace main service entry
                                  filteredStored = idx > -1
                                    ? filteredStored.concat([newEntry])
                                    : filteredStored.concat([newEntry]);

                                  // Add add-on entries
                                  const updatedServices = filteredStored.concat(addOnEntries);

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
                          {/* Only show checkbox if not quote and add-on does not have options or quote */}
                          {serviceData.quote !== true && !related.hasOptionsOrQuote && (
                            <input
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
                            />
                          )}
                          <Link href={`/services/${category}/${related.slug}`} className="flex items-center flex-1 min-w-0">
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
