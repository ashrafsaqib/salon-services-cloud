"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceCard } from "@/components/common/service-card"
import type { FeaturedCategory } from "@/types"
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
                  <ServiceCard
                    key={index} service={service}
                  />
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
