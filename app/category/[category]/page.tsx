import { shouldUseCache } from "@/utils/cacheUtils"
// app/category/[category]/page.tsx
import { Metadata } from "next"
import ClientPage from "./client-page"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  let categoryData = null
  let zoneId = ''
  if (typeof window !== 'undefined') {
    zoneId = localStorage.getItem('selected_zone_id') || ''
  }
  try {
    if (shouldUseCache() == true) {
      const jsonFileName = zoneId ? `${params.category}_${zoneId}.json` : `${params.category}.json`
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayTimestamp = today.getTime();
      const localRes = await fetch(`https://partner.lipslay.com/jsonCache/categories/${jsonFileName}?ts=${dayTimestamp}`)
      if (localRes.ok) {
        categoryData = await localRes.json()
      }
    }
    if (!categoryData) {
      const apiRes = await fetch(`${API_BASE_URL}/api/category?category=${encodeURIComponent(params.category)}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`)
      if (!apiRes.ok) return {}
      categoryData = await apiRes.json()
    }
  } catch {
    return {};
  }
  if (!categoryData) return {}
  return {
    title: `${categoryData.meta_title ?? categoryData.title} | Lipslay Marketplace`,
    description: categoryData.meta_description ?? categoryData.description,
    keywords: categoryData.meta_keywords ?? undefined,
  }
}

export default function Page({ params }: { params: { category: string } }) {
  return <ClientPage params={params} />
}