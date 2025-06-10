"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface ServicePageProps {
  params: Promise<{
    category: string
  }>
}

interface Subcategory {
  title: string
  description: string
  image: string
  popular: boolean
  slug: string
}

interface Service {
  name: string
  price: string
  duration: string
  rating: number
  description: string
  image: string
  features: string[]
  slug: string
}

interface CategoryData {
  title: string
  description: string
  image: string
  subcategories?: Subcategory[]
  services: Service[]
}

export default function ServiceCategoryPage({ params }: ServicePageProps) {
  const { category } = use(params)
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(`${API_BASE_URL}/api/category?category=${encodeURIComponent(category)}`)
        if (!res.ok) throw new Error("Category not found")
        const data = await res.json()
        if (!data) throw new Error("No data")
        setCategoryData(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [category])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">Loading category...</span>
      </div>
    )
  }

  if (error || !categoryData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={categoryData.image || "/placeholder.svg"} alt={categoryData.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{categoryData.title}</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">{categoryData.description}</p>
        </div>
      </section>

      {/* Subcategories */}
      {categoryData.subcategories && categoryData.subcategories.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Subcategories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryData.subcategories.map((subcat, idx) => (
                <Link href={`/services/${subcat.slug}`} key={subcat.slug}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <div className="h-32 bg-gray-200 relative">
                      <Image
                        src={
                          subcat.image
                            ? subcat.image.startsWith("http")
                              ? subcat.image
                              : subcat.image
                            : "/placeholder.svg"
                        }
                        alt={subcat.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{subcat.title}</h3>
                      <p className="text-gray-600 text-sm">{subcat.description}</p>
                      {subcat.popular && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-rose-100 text-rose-700 rounded-full">
                          Popular
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryData.services.map((service, index) => (
              <Link href={`/services/${category}/${service.slug}`} key={index}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <div className="h-48 bg-gray-200 relative">
                    <Image
                      src={
                        service.image
                          ? service.image.startsWith("http")
                            ? service.image
                            : service.image
                          : "/placeholder.svg"
                      }
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{service.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        At your location
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">What's included:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Shield className="h-3 w-3 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-rose-600">{service.price}</span>
                      <Button className="bg-rose-600 hover:bg-rose-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
