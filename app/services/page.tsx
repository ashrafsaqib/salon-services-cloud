"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/layout/layout"
import { CategoryCard } from "@/components/ui/category-card"
import type { Category } from "@/types"
import Loading from "../loading"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loading />
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete range of professional services
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
            <div key={category.id} className="mb-4">
              <CategoryCard cat={category} />
            </div>
            ))}
          </div>
        </div>
      </section>

      </Layout>
    </div>
  )
}
