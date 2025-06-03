import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ServicesCarousel } from "@/components/sections/services-carousel"

export default function ServicesPage() {
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
        </div>
      </section>

      <ServicesCarousel />

      <Footer />
    </div>
  )
}
