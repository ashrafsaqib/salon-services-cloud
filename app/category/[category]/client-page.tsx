"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Layout from "@/components/layout/layout"
import { CategoryCard } from "@/components/ui/category-card"
import { ServiceCard } from "@/components/common/service-card"
import type { CategoryData, Category, Service } from "@/types"
import Loading from "@/app/loading"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ServicePageProps {
  params: Promise<{
    category: string
  }>
}

export default function ClientPage({ params }: ServicePageProps) {
  const { category } = use(params)
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true)
      setError(false)
      try {
        let zoneId = '';
        if (typeof window !== 'undefined') {
          zoneId = localStorage.getItem('selected_zone_id') || '';
        }
        let data = null;
        try {
          const jsonFileName = zoneId ? `${category}_${zoneId}.json` : `${category}.json`
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dayTimestamp = today.getTime();
          const localRes = await fetch(`https://partner.lipslay.com/jsonCache/categories/${jsonFileName}?ts=${dayTimestamp}`)
          if (!localRes.ok) throw new Error('Not found')
          data = await localRes.json()
        } catch {
          const apiRes = await fetch(
            `${API_BASE_URL}/api/category?category=${encodeURIComponent(category)}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`
          );
          if (!apiRes.ok) throw new Error("Category not found")
          data = await apiRes.json()
        }
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
    return <Loading />
  }

  if (error || !categoryData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryData.subcategories.map((subcat: Category) => (
              <div key={subcat.id} className="mb-4">
                <CategoryCard
                  cat={subcat}
                />
              </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryData.services.map((service: Service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        </div>
      </section>

      </Layout>
    </div>
  )
}
