import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Service } from "@/types"

export interface ServiceCardProps {
  service: Service
}

export function ServiceCard( {service}: ServiceCardProps) {
  const {
    name,
    price,
    rating,
    image,
    slug,
    category,
    description,
    duration,
    features
  } = service
  const link = category ? `/services/${category}/${slug}` : `/services/${slug}`
  return (
    <Link href={link}>
      <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
        <div className="h-48 bg-gray-200 relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
            {rating !== undefined && (
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm">{rating}</span>
              </div>
            )}
          </div>

          {description && <p className="text-gray-600 mb-4">{description}</p>}

          {(duration || category) && (
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              {duration && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {duration}
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                At your location
              </div>
            </div>
          )}

          {features && features.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">What's included:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Shield className="h-3 w-3 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-rose-600">{price}</span>
            
              <Button className="bg-rose-600 hover:bg-rose-700" onClick={e => { e.preventDefault(); /* handle booking here if needed */ }}>
                Book Now
              </Button>
           
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}