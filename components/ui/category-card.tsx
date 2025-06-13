import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/types"

interface CategoryCardProps {
  cat: Category
}

export function CategoryCard({ cat }: CategoryCardProps) {
  const { title, description, image, popular, href } = cat

  return (
    <Card className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
      <Link href={'/services/'+href}>
        <div className="h-48 bg-gray-200 relative">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          {popular && (
            <div className="absolute top-3 left-3 bg-rose-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Popular
            </div>
          )}
        </div>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 text-sm">{description}</p>
        </CardContent>
      </Link>
    </Card>
  )
}
