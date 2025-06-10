"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Service {
  name: string
  price: string
  rating: number | null
  image: string
  slug?: string
  category?: string
}

interface FeaturedCategory {
  name: string
  slug: string
  services: Service[]
}

interface FeaturedServicesProps {
  featured: FeaturedCategory[]
}

export function FeaturedServices({ featured }: FeaturedServicesProps) {
  // Only show tabs for categories with at least one service
  const categoriesWithServices = featured.filter(cat => cat.services.length > 0)
  const firstTab = categoriesWithServices[0]?.slug || ""

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Featured Services</h2>
        <Tabs defaultValue={firstTab} className="w-full">
          <TabsList className="justify-center">
            {categoriesWithServices.map(cat => (
              <TabsTrigger key={cat.slug} value={cat.slug}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categoriesWithServices.map(cat => (
            <TabsContent key={cat.slug} value={cat.slug} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cat.services.map((service, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
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
                        {service.rating !== null && service.rating !== undefined && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{service.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-rose-600">
                          {service.price ? `AED ${service.price}` : ""}
                        </span>
                        <Button
                          size="sm"
                          className="bg-rose-600 hover:bg-rose-700"
                          onClick={() =>
                            (window.location.href = `/book?service=${encodeURIComponent(service.name)}&category=${encodeURIComponent(cat.slug)}`)
                          }
                        >
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
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
