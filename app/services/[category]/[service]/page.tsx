"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin, Calendar, ChevronRight, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StaffCard } from "@/components/ui/staff-card"
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

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/service?query=${encodeURIComponent(`${service}`)}`
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Loading service details...</span>
      </div>
    )
  }

  if (error || !serviceData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
              <p className="text-lg text-gray-600 mb-6">{serviceData.longDescription}</p>

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
                  <span className="font-semibold">{serviceData.price}</span>
                </div>
              </div>

              <Button className="bg-rose-600 hover:bg-rose-700 h-12 px-8 text-lg">Book This Service</Button>
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
                  <p className="text-gray-600 mb-6">{serviceData.longDescription}</p>

                  <h3 className="text-xl font-semibold mb-3">What's Included</h3>
                  <ul className="space-y-2 mb-6">
                    {serviceData.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

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
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Book This Service</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                          <div className="flex items-center border rounded-md p-2">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-500">Choose a date</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"].map((time, index) => (
                              <div
                                key={index}
                                className="border rounded-md p-2 text-center text-sm cursor-pointer hover:border-rose-500 hover:text-rose-500"
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button className="w-full bg-rose-600 hover:bg-rose-700">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Related Services</h3>
                    <div className="space-y-4">
                      {serviceData.relatedServices.map((related: any, index: number) => (
                        <Link href={`/services/${category}/${related.slug}`} key={index}>
                          <div className="flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={related.image || "/placeholder.svg"}
                                alt={related.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium">{related.name}</h4>
                              <p className="text-rose-600">{related.price}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
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

      <Footer />
    </div>
  )
}
