import type { Service } from "@/types"

export const BOOKING_SERVICES_KEY = "booking_selected_services"

export function getStoredServices(): { service: Service; options?: number[] }[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(BOOKING_SERVICES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getUserIdFromStorage(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("user_id") || null
}

// return selected_zone_id from loccalStorage
export function getSelectedZoneId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("selected_zone_id") || null
}
