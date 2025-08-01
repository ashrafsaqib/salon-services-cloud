import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Testimonial {
  name: string
  service: string
  comment: string
  image: string
  rating?: number
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null // Don't show if no testimonials
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Read testimonials from our satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating ?? 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 line-clamp-3">{testimonial.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
