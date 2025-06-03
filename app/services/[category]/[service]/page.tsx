import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin, Calendar, ChevronRight, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StaffCard } from "@/components/ui/staff-card"

interface ServiceDetailPageProps {
  params: {
    category: string
    service: string
  }
}

// This would typically come from a database
const serviceDetails = {
  "ladies-salon": {
    "hair-styling-cut": {
      name: "Hair Styling & Cut",
      price: "$45",
      duration: "60 min",
      rating: 4.9,
      description:
        "Professional hair cutting and styling services tailored to your preferences and face shape. Our experienced stylists will help you achieve the perfect look.",
      longDescription:
        "Transform your look with our professional hair styling and cutting service. Our expert stylists begin with a thorough consultation to understand your preferences, lifestyle, and hair type. Using premium products and precision techniques, they'll create a style that enhances your natural features and suits your personality. Whether you're looking for a complete makeover or a simple trim, our stylists have the skills and experience to deliver exceptional results.",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop",
      ],
      features: [
        "Consultation included",
        "Premium products",
        "Style guarantee",
        "Wash and blow dry included",
        "Styling tips and product recommendations",
      ],
      faqs: [
        {
          question: "How long does the service take?",
          answer:
            "The service typically takes 60 minutes, but may vary depending on hair length and complexity of the style.",
        },
        {
          question: "Do I need to wash my hair before the appointment?",
          answer: "No, our service includes a professional wash with premium products.",
        },
        {
          question: "What products do you use?",
          answer: "We use salon-quality professional products that are suitable for your hair type and concerns.",
        },
      ],
      relatedServices: [
        {
          name: "Hair Color & Highlights",
          price: "$85",
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
          slug: "hair-color-highlights",
        },
        {
          name: "Hair Treatment",
          price: "$65",
          image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1000&auto=format&fit=crop",
          slug: "hair-treatment",
        },
      ],
      staffMembers: [
        {
          name: "Sarah Martinez",
          role: "Senior Hair Stylist",
          experience: "8+ years",
          rating: 4.9,
          specialties: ["Hair Color", "Bridal Styling", "Cuts"],
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
        },
        {
          name: "Emily Rodriguez",
          role: "Hair Specialist",
          experience: "6+ years",
          rating: 4.8,
          specialties: ["Styling", "Cuts", "Treatments"],
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
        },
      ],
      reviews: [
        {
          name: "Jennifer K.",
          rating: 5,
          date: "2 weeks ago",
          comment:
            "Sarah did an amazing job with my haircut! She understood exactly what I wanted and gave great styling tips too.",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
        },
        {
          name: "Michelle T.",
          rating: 4,
          date: "1 month ago",
          comment: "Great service and very professional. The stylist was knowledgeable and gave me a fantastic cut.",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
        },
      ],
    },
    "facial-treatment": {
      name: "Facial Treatment",
      price: "$60",
      duration: "75 min",
      rating: 4.7,
      description: "Rejuvenating facial treatments for all skin types",
      longDescription:
        "Revitalize your skin with our professional facial treatments designed to address your specific skin concerns. Our experienced estheticians will analyze your skin and customize the treatment to give you the best results. Using premium skincare products and advanced techniques, we'll cleanse, exfoliate, and nourish your skin for a radiant, healthy glow.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?q=80&w=1000&auto=format&fit=crop",
      ],
      features: [
        "Skin analysis",
        "Customized treatment",
        "Aftercare advice",
        "Premium skincare products",
        "Relaxing experience",
      ],
      faqs: [
        {
          question: "How often should I get a facial?",
          answer:
            "For best results, we recommend getting a facial every 4-6 weeks, as this is the average skin cell turnover time.",
        },
        {
          question: "Will my face be red after the treatment?",
          answer:
            "Some mild redness is normal and usually subsides within a few hours. We provide aftercare instructions to minimize any redness.",
        },
      ],
      relatedServices: [
        {
          name: "Deep Cleansing Facial",
          price: "$75",
          image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop",
          slug: "deep-cleansing-facial",
        },
      ],
      staffMembers: [
        {
          name: "Emily Rodriguez",
          role: "Beauty Specialist",
          experience: "6+ years",
          rating: 4.9,
          specialties: ["Facials", "Makeup", "Skincare"],
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
        },
      ],
      reviews: [
        {
          name: "Lisa M.",
          rating: 5,
          date: "3 weeks ago",
          comment:
            "The facial was amazing! My skin feels so refreshed and the esthetician gave me great skincare tips.",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
        },
      ],
    },
  },
  "gents-salon": {
    "haircut-styling": {
      name: "Haircut & Styling",
      price: "$30",
      duration: "45 min",
      rating: 4.8,
      description: "Modern and classic haircuts with styling",
      longDescription:
        "Get a professional haircut tailored to your style and preferences. Our expert barbers specialize in both modern and classic cuts, ensuring you leave looking and feeling your best. The service includes a consultation, wash, cut, and styling with premium products.",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1000&auto=format&fit=crop",
      ],
      features: [
        "Style consultation",
        "Wash included",
        "Styling products",
        "Hot towel service",
        "Neck and shoulder massage",
      ],
      faqs: [
        {
          question: "How often should I get a haircut?",
          answer: "For most men, we recommend getting a haircut every 3-4 weeks to maintain your style.",
        },
        {
          question: "Do you provide styling tips?",
          answer: "Yes, our barbers will show you how to style your hair at home and recommend suitable products.",
        },
      ],
      relatedServices: [
        {
          name: "Beard Trim & Shave",
          price: "$25",
          image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1000&auto=format&fit=crop",
          slug: "beard-trim-shave",
        },
      ],
      staffMembers: [
        {
          name: "Michael Chen",
          role: "Master Barber",
          experience: "10+ years",
          rating: 4.8,
          specialties: ["Classic Cuts", "Beard Styling", "Hot Towel Shave"],
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
        },
      ],
      reviews: [
        {
          name: "Robert J.",
          rating: 5,
          date: "1 week ago",
          comment:
            "Michael gave me the best haircut I've had in years. Very attentive to detail and understood exactly what I wanted.",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
        },
      ],
    },
  },
  automotive: {
    "car-wash-detailing": {
      name: "Car Wash & Detailing",
      price: "$45",
      duration: "90 min",
      rating: 4.7,
      description: "Complete exterior and interior car cleaning",
      longDescription:
        "Our comprehensive car wash and detailing service will leave your vehicle looking like new. We use premium cleaning products and techniques to clean both the exterior and interior of your car, removing dirt, dust, and stains for a fresh, clean look and feel.",
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop",
      ],
      features: [
        "Exterior wash",
        "Interior cleaning",
        "Wax protection",
        "Tire and rim cleaning",
        "Dashboard and console detailing",
      ],
      faqs: [
        {
          question: "How long does the service take?",
          answer:
            "The standard service takes approximately 90 minutes, but may vary depending on the size and condition of your vehicle.",
        },
        {
          question: "Do I need to prepare my car before the service?",
          answer:
            "We recommend removing personal items from your car before the service to ensure a thorough cleaning.",
        },
      ],
      relatedServices: [
        {
          name: "Interior Detailing",
          price: "$35",
          image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop",
          slug: "interior-detailing",
        },
      ],
      staffMembers: [
        {
          name: "David Thompson",
          role: "Auto Detailing Expert",
          experience: "12+ years",
          rating: 4.7,
          specialties: ["Paint Protection", "Interior Detailing", "Ceramic Coating"],
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
        },
      ],
      reviews: [
        {
          name: "James L.",
          rating: 5,
          date: "2 weeks ago",
          comment: "Excellent service! My car looks brand new. The attention to detail was impressive.",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
        },
      ],
    },
  },
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { category, service } = params

  // Check if the category and service exist
  if (
    !serviceDetails[category as keyof typeof serviceDetails] ||
    !serviceDetails[category as keyof typeof serviceDetails][service as any]
  ) {
    notFound()
  }

  const serviceData = serviceDetails[category as keyof typeof serviceDetails][service as any]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/services" className="hover:text-gray-900">
              Services
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href={`/services/${category}`} className="hover:text-gray-900">
              {category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 font-medium">{serviceData.name}</span>
          </div>
        </div>
      </div>

      {/* Service Hero */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(serviceData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {serviceData.rating} ({serviceData.reviews.length} reviews)
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{serviceData.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{serviceData.longDescription}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{serviceData.duration}</span>
                </div>
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span>At your location</span>
                </div>
                <div className="flex items-center bg-rose-100 px-4 py-2 rounded-full text-rose-700">
                  <span className="font-semibold">{serviceData.price}</span>
                </div>
              </div>

              <Button className="bg-rose-600 hover:bg-rose-700 h-12 px-8 text-lg">Book This Service</Button>
            </div>

            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src={serviceData.image || "/placeholder.svg"}
                alt={serviceData.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
                  <p className="text-gray-600 mb-6">{serviceData.longDescription}</p>

                  <h3 className="text-xl font-semibold mb-3">What's Included</h3>
                  <ul className="space-y-2 mb-6">
                    {serviceData.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Service Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {serviceData.gallery.map((image, index) => (
                      <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${serviceData.name} gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Book This Service</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                          <div className="flex items-center border rounded-md p-2">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-gray-500">Choose a date</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"].map((time, index) => (
                              <div
                                key={index}
                                className="border rounded-md p-2 text-center text-sm cursor-pointer hover:border-rose-500 hover:text-rose-500"
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button className="w-full bg-rose-600 hover:bg-rose-700">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Related Services</h3>
                    <div className="space-y-4">
                      {serviceData.relatedServices.map((related, index) => (
                        <Link href={`/services/${category}/${related.slug}`} key={index}>
                          <div className="flex items-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                            <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={related.image || "/placeholder.svg"}
                                alt={related.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium">{related.name}</h4>
                              <p className="text-rose-600">{related.price}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="staff" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Available Staff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceData.staffMembers.map((staff, index) => (
                  <StaffCard key={index} {...staff} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {serviceData.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={review.image || "/placeholder.svg"}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium mr-2">{review.name}</h4>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <div className="flex my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {serviceData.faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Info className="h-5 w-5 text-rose-500 mr-2" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 pl-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
