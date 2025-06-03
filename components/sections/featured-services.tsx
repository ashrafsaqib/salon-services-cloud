"use client"

import Image from "next/image"
import { Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FeaturedServices() {
  return (
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
                    <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
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
                    <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
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
                    <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
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
  )
}
