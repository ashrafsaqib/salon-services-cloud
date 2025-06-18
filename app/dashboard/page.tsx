"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.replace("/login")
      return
    }
    const fetchOrders = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
          {loading ? (
            <div className="text-gray-500 text-lg">Loading orders...</div>
          ) : error ? (
            <div className="text-red-600 text-lg">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-600">No orders found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                      <div>
                        <div className="font-semibold text-lg">Order #{order.id}</div>
                        <div className="text-gray-500 text-sm">{order.date}</div>
                      </div>
                      <div className="text-rose-600 font-bold text-lg">
                        {order.currency_symbol ? order.currency_symbol : "$"}{order.total_amount}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-gray-700 text-sm mb-2">
                      <div>Status: <span className="font-medium">{order.status}</span></div>
                      <div>Payment: <span className="font-medium">{order.payment_method}</span></div>
                      <div>Customer: <span className="font-medium">{order.customer_name}</span></div>
                      <div>Staff: <span className="font-medium">{order.staff_name}</span></div>
                      <div>Time Slot: <span className="font-medium">{order.time_slot_value}</span></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
