import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface StaffCardProps {
  id: string | number
  name: string
  role: string
  experience: string
  rating: number
  specialties: string[]
  image: string
  charges?: string
}

export function StaffCard({ id, name, role, experience, rating, specialties, image, charges }: StaffCardProps) {
  return (
    <Card className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow overflow-hidden">
      <div className="h-64 bg-gray-200 relative">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
        <div className="flex items-center justify-center mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
        {charges && charges > 0 && (
          <div className="mb-3 text-sm text-blue-600 font-semibold">Extra Charges: {charges}</div>
        )}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {specialties.map((specialty, idx) => (
            <span key={idx} className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full">
              {specialty}
            </span>
          ))}
        </div>
        <Link href={`/staffProfile/${id}`} passHref legacyBehavior>
          <Button variant="outline" className="text-rose-600 border-rose-600 hover:bg-rose-50 w-full" asChild>
            <a>View Profile</a>
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
