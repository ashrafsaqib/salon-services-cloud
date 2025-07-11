import Layout from "@/components/layout/layout"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Lipslay Marketplace</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for premium beauty, wellness, and automotive services delivered to your doorstep.
            </p>
          </div>

          <div className="prose prose-lg max-w-4xl mx-auto">
            <p>
              Founded with a vision to revolutionize the service industry, Lipslay Marketplace brings professional
              beauty, wellness, and automotive services directly to your location. We believe that quality services
              should be convenient, accessible, and delivered by certified professionals.
            </p>

            <h2>Our Mission</h2>
            <p>
              To provide exceptional on-demand services that save you time while delivering professional results in the
              comfort of your own space.
            </p>

            <h2>Why Choose Us?</h2>
            <ul>
              <li>Certified and experienced professionals</li>
              <li>Convenient scheduling and booking</li>
              <li>Premium quality products and equipment</li>
              <li>Satisfaction guarantee</li>
              <li>Competitive pricing</li>
            </ul>
          </div>
        </div>
      </section>
      </Layout>
    </div>
  )
}
