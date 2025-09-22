export interface Service {
    id: string
  name: string
  price: string
  discount: string
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

export interface StaffMember {
  id: string
  name: string
  role?: string
  experience?: string
  rating?: number
  specialties?: string[]
  image?: string
  priceModifier?: number
  bio?: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  notes?: string
  // Extended fields for booking form
  phone_number?: string
  whatsapp_number?: string
  gender?: string
  affiliate_code?: string
  coupon_code?: string
  save_data?: boolean
  building_name?: string
  flat_or_villa?: string
  street?: string
  area?: string
  district?: string
  landmark?: string
  city?: string
  latitude?: string
  longitude?: string,
  comment?: string,
  driver_comment?: string,
}

export interface BookingData {
  services: Service[]
  date?: string
  staff?: StaffMember
  timeSlot?: string
  staffAndSlotsData?: any
  customerInfo?: CustomerInfo
}
