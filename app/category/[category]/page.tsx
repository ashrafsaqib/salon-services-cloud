// app/category/[category]/page.tsx
import { Metadata } from "next"
import ClientPage from "./client-page"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const res = await fetch(`${API_BASE_URL}/api/category?category=${encodeURIComponent(params.category)}`)
  if (!res.ok) return {}
  
  const categoryData = await res.json()
  
  return {
    title: `${categoryData.meta_title || categoryData.title} | Lipslay Marketplace`,
    description: categoryData.meta_description || categoryData.description,
    keywords: categoryData.meta_keywords || undefined,
  }
}

export default function Page({ params }: { params: { category: string } }) {
  return <ClientPage params={params} />
}