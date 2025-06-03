"use client"

import { HeroSection } from "@/components/sections/hero-section"
import { ServicesCarousel } from "@/components/sections/services-carousel"
import { FeaturedServices } from "@/components/sections/featured-services"
import { HowItWorks } from "@/components/sections/how-it-works"
import { StaffCarousel } from "@/components/sections/staff-carousel"
import { Testimonials } from "@/components/sections/testimonials"
import { AppPromotion } from "@/components/sections/app-promotion"
import { FAQSection } from "@/components/sections/faq-section"
import { Newsletter } from "@/components/sections/newsletter"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <ServicesCarousel />
      <FeaturedServices />
      <HowItWorks />
      <StaffCarousel />
      <Testimonials />
      <AppPromotion />
      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  )
}
