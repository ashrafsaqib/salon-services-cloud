export interface Service {
    id: string
  name: string
  price: string
  rating?: number | null
  image?: string
  slug?: string
  category?: string
  description?: string
  features?: string[]
  duration?: string
}

export interface Category {
  id: string
  title: string
  description: string
  image: string
  popular?: boolean
  href: string
}

export interface Subcategory {
  slug: string
  title: string
  description: string
  image: string
  popular?: boolean
}

export interface FAQ {
  question: string
  answer: string
}

export interface CategoryData {
  title: string
  description: string
  image: string,
    slug: string
  subcategories?: Category[]
  services: Service[]
}
export interface FeaturedCategory {
  name: string
  slug: string
  services: Service[]
}
