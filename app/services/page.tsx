"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Category {
  slug: string
  title: string
  description: string
  image: string
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete range of professional services
            </p>
          </div>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map(category => (
                <Link href={`/services/${category.slug}`} key={category.slug}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="h-48 bg-gray-200 relative">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-2">{category.title}</h2>
                      <p className="text-gray-600">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
