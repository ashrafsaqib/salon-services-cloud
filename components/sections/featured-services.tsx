"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceCard } from "@/components/common/service-card"
import type { Service } from "@/types"

interface FeaturedServicesProps {
  featured: {
    [category: string]: Service[]
  }
}

export function FeaturedServices({ featured }: FeaturedServicesProps) {
  const categories = Object.keys(featured || {})
  const [activeTab, setActiveTab] = useState(categories[0] || "")

  if (!featured || categories.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our most popular and highly-rated services</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-friendly tabs with horizontal scroll */}
          <div className="overflow-x-auto scrollbar-hide mb-8">
            <TabsList className="inline-flex min-w-max mx-auto bg-white border border-gray-200 p-1 rounded-lg">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 text-sm font-medium whitespace-nowrap data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div
                className={`grid gap-6 ${
                  featured[category].length === 1
                    ? "grid-cols-1 justify-items-center max-w-md mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {featured[category].services.map((service, index) => (
                  <ServiceCard key={index} service={service} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
