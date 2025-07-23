// app/category/[category]/page.tsx
import { Metadata } from "next"
import ClientPage from "./client-page"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
  const res = await fetch(`${API_BASE_URL}/api/service?query=${encodeURIComponent(params.service)}`)
  if (!res.ok) return {}

  const serviceData = await res.json()

  return {
    title: `${serviceData.meta_title ?? serviceData.name} | Lipslay Marketplace`,
    description: serviceData.meta_description ?? serviceData.description,
    keywords: serviceData.meta_keywords ?? undefined,
  }
}

export default function Page({ params }: { params: { service: string } }) {
  return <ClientPage params={params} />
}