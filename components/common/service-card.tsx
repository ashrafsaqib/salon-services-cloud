import Image from "next/image"
import Link from "next/link"
import { Star, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Service } from "@/types"

export interface ServiceCardProps {
  service: Service
}

export function ServiceCard( {service}: ServiceCardProps) {
  const {
    name,
    price,
    discount,
    rating,
    image,
    slug,
    description,
    duration,
  } = service
  return (
    <Link href={'/service/'+slug}>
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

          {description && (
            <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: description }} />
          )}

          {(duration) && (
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
          <div className="flex justify-between items-center">
            {discount ? (
              <>
                <span className="text-xl font-semibold text-gray-400 line-through mr-2">{price}</span>
                <span className="text-2xl font-bold text-rose-600">{discount}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-rose-600">{price}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
