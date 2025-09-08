// app/category/[category]/page.tsx
import { Metadata } from "next"
import ClientPage from "./client-page"
import { shouldUseCache } from "@/utils/cacheUtils";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
  let serviceData = null
  let zoneId = ''
  if (typeof window !== 'undefined') {
    zoneId = localStorage.getItem('selected_zone_id') || ''
  }
  try {
    if (shouldUseCache() == true) {
      const jsonFileName = zoneId ? `${params.service}_${zoneId}.json` : `${params.service}.json`
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayTimestamp = today.getTime();
      const localRes = await fetch(`https://partner.lipslay.com/jsonCache/services/${jsonFileName}?ts=${dayTimestamp}`)
      if (localRes.ok) {
        serviceData = await localRes.json()
      }
    }
    if (!serviceData) {
      const apiRes = await fetch(`${API_BASE_URL}/api/service?query=${encodeURIComponent(`${params.service}`)}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`)
      if (!apiRes.ok) return {}
      serviceData = await apiRes.json()
    }
  } catch {
    return {}
  }

  return {
    title: `${serviceData.meta_title ?? serviceData.name} | Lipslay Marketplace`,
    description: serviceData.meta_description ?? serviceData.description,
    keywords: serviceData.meta_keywords ?? undefined,
  }
}

export default function Page({ params }: { params: { service: string } }) {
  return <ClientPage params={params} />
}