"use client"

import { useEffect, useState } from "react"
import { HeroSection } from "@/components/sections/hero-section"
import { CategoryCarousel } from "@/components/sections/category-carousel"
import { FeaturedServices } from "@/components/sections/featured-services"
import { HowItWorks } from "@/components/sections/how-it-works"
import { StaffCarousel } from "@/components/sections/staff-carousel"
import { Testimonials } from "@/components/sections/testimonials"
import { AppPromotion } from "@/components/sections/app-promotion"
import { FAQSection } from "@/components/sections/faq-section"
import { Newsletter } from "@/components/sections/newsletter"
import Layout from "@/components/layout/layout"
import Loading from "./loading"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function HomePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let zoneId = '';
    if (typeof window !== 'undefined') {
      zoneId = localStorage.getItem('selected_zone_id') || '';
    }
    fetch(`${API_BASE_URL}/api/home${zoneId ? `?zoneId=${encodeURIComponent(zoneId)}` : ''}`)
      .then(res => res.json())
      .then((resData) => {
        setData(resData);
        if (resData?.whatsappNumber) {
          localStorage.setItem("whatsappNumber", resData.whatsappNumber);
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loading />
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load data.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
      <HeroSection />
      <CategoryCarousel services={data.categoryCarousel} />
      <FeaturedServices featured={data.featuredServices} />
      <HowItWorks />
      <StaffCarousel staff={data.staffMembers} />
      <Testimonials testimonials={data.testimonials} />
      <AppPromotion promotion={data.appPromotion} />
      <FAQSection faqs={data.faqs} />
      {/* <Newsletter newsletter={data.newsletter} /> */}
      </Layout>
    </div>
  )
}
