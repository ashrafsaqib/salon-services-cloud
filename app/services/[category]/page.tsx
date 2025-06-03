import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface ServicePageProps {
  params: {
    category: string
  }
}

const serviceCategories = {
  "ladies-salon": {
    title: "Ladies Salon Services",
    description: "Professional beauty and wellness services for women",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2070&auto=format&fit=crop",
    services: [
      {
        name: "Hair Styling & Cut",
        price: "$45",
        duration: "60 min",
        rating: 4.9,
        description: "Professional hair cutting and styling services",
        image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1000&auto=format&fit=crop",
        features: ["Consultation included", "Premium products", "Style guarantee"],
        slug: "hair-styling-cut",
      },
      {
        name: "Hair Color & Highlights",
        price: "$85",
        duration: "120 min",
        rating: 4.8,
        description: "Expert hair coloring and highlighting services",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
        features: ["Color consultation", "Premium color products", "Touch-up guarantee"],
        slug: "hair-color-highlights",
      },
      {
        name: "Facial Treatment",
        price: "$60",
        duration: "75 min",
        rating: 4.7,
        description: "Rejuvenating facial treatments for all skin types",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop",
        features: ["Skin analysis", "Customized treatment", "Aftercare advice"],
        slug: "facial-treatment",
      },
      {
        name: "Manicure & Pedicure",
        price: "$35",
        duration: "45 min",
        rating: 4.8,
        description: "Complete nail care and beautification",
        image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1000&auto=format&fit=crop",
        features: ["Nail shaping", "Cuticle care", "Polish application"],
        slug: "manicure-pedicure",
      },
    ],
  },
  "gents-salon": {
    title: "Gents Salon Services",
    description: "Professional grooming services for men",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop",
    services: [
      {
        name: "Haircut & Styling",
        price: "$30",
        duration: "45 min",
        rating: 4.8,
        description: "Modern and classic haircuts with styling",
        image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop",
        features: ["Style consultation", "Wash included", "Styling products"],
        slug: "haircut-styling",
      },
      {
        name: "Beard Trim & Shave",
        price: "$25",
        duration: "30 min",
        rating: 4.9,
        description: "Professional beard trimming and clean shave",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1000&auto=format&fit=crop",
        features: ["Hot towel treatment", "Precision trimming", "Aftershave care"],
        slug: "beard-trim-shave",
      },
    ],
  },
  automotive: {
    title: "Automotive Services",
    description: "Professional car care and maintenance services",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2070&auto=format&fit=crop",
    services: [
      {
        name: "Car Wash & Detailing",
        price: "$45",
        duration: "90 min",
        rating: 4.7,
        description: "Complete exterior and interior car cleaning",
        image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop",
        features: ["Exterior wash", "Interior cleaning", "Wax protection"],
        slug: "car-wash-detailing",
      },
    ],
  },
}

export default function ServiceCategoryPage({ params }: ServicePageProps) {
  const category = serviceCategories[params.category as keyof typeof serviceCategories]

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={category.image || "/placeholder.svg"} alt={category.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.title}</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">{category.description}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.services.map((service, index) => (
              <Link href={`/services/${params.category}/${service.slug}`} key={index}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <div className="h-48 bg-gray-200 relative">
                    <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{service.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        At your location
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">What's included:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <Shield className="h-3 w-3 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-rose-600">{service.price}</span>
                      <Button className="bg-rose-600 hover:bg-rose-700">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
