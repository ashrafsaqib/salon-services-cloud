"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { ComplaintViewModal } from "@/components/complaint/ComplaintViewModal"
import { checkToken } from "@/lib/auth"
import Loading from "../loading"

interface Order {
  id: number
  date?: string
  currency_symbol?: string
  currency_rate?: number
  total_amount?: string | number
  status?: string
  payment_method?: string
  customer_name?: string
  staff_name?: string
  time_slot_value?: string
  complaint_id?: number | null
}

interface Complaint {
  id: number
  title: string
  description: string
  status: string
  user_id: number
  order_id: number
  created_at: string
  updated_at: string
}

interface ComplaintChat {
  id: number
  text: string
  user_id: number
  complaint_id: number
  created_at: string
  updated_at: string
  self?: boolean
}

interface ComplaintDetail extends Complaint {
  chats: ComplaintChat[]
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [complaintOrderId, setComplaintOrderId] = useState<number | null>(null)
  const [complaintTitle, setComplaintTitle] = useState("")
  const [complaintDescription, setComplaintDescription] = useState("")
  const [complaintLoading, setComplaintLoading] = useState(false)
  const [complaintError, setComplaintError] = useState("")
  // New state for viewing complaint
  const [viewComplaintId, setViewComplaintId] = useState<number | null>(null)
  // Remove viewComplaintDetail, viewComplaintLoading, chatText, chatLoading
  const router = useRouter()

  useEffect(() => {
    const token = checkToken(router)
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

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return
    const token = checkToken(router)
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
      })
      if (!res.ok) throw new Error("Failed to cancel order")
      // Reload orders
      setLoading(true)
      setError("")
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!ordersRes.ok) throw new Error("Failed to fetch orders")
      const data = await ordersRes.json()
      setOrders(data.orders || [])
    } catch (err: any) {
      setError(err.message || "Failed to cancel order")
    } finally {
      setLoading(false)
    }
  }

  const openComplaintModal = (orderId: number) => {
    setComplaintOrderId(orderId)
    setComplaintTitle("")
    setComplaintDescription("")
    setComplaintError("")
    setShowComplaintModal(true)
  }
  const closeComplaintModal = () => {
    setShowComplaintModal(false)
    setComplaintOrderId(null)
    setComplaintTitle("")
    setComplaintDescription("")
    setComplaintError("")
  }
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!complaintOrderId || !complaintTitle.trim() || !complaintDescription.trim()) {
      setComplaintError("Please fill all fields.")
      return
    }
    setComplaintLoading(true)
    setComplaintError("")
    const token = checkToken(router)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: complaintTitle,
          description: complaintDescription,
          order_id: complaintOrderId
        })
      })
      if (!res.ok) throw new Error("Failed to submit complaint")
      sessionStorage.setItem("flashMessage", "Your complaint has been submitted successfully.")
      router.push("/complaints")
    } catch (err: any) {
      setComplaintError(err.message || "Failed to submit complaint")
    } finally {
      setComplaintLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
          {error ? (
            <div className="text-red-600 text-lg">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-600">No orders found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: Order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                      <div>
                        <div className="font-semibold text-lg">Order #{order.id}</div>
                        <div className="text-gray-500 text-sm">{order.date}</div>
                      </div>
                      <div className="text-rose-600 font-bold text-lg">
                        AED {order.total_amount}
                        {order.currency_symbol && order.currency_rate && (
                          <span className="ml-2 text-gray-500 text-base">({order.currency_symbol} {(Number(order.total_amount) * Number(order.currency_rate)).toFixed(2)})</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-gray-700 text-sm mb-2">
                      <div>Status: <span className="font-medium">{order.status}</span></div>
                      <div>Payment: <span className="font-medium">{order.payment_method}</span></div>
                      <div>Customer: <span className="font-medium">{order.customer_name}</span></div>
                      <div>Staff: <span className="font-medium">{order.staff_name}</span></div>
                      <div>Time Slot: <span className="font-medium">{order.time_slot_value}</span></div>
                    </div>
                    {order.status === "Pending" && (
                      <button
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={loading}
                      >
                        Cancel Order
                      </button>
                    )}
                    {/* Complaint Button Logic */}
                    {order.complaint_id == null ? (
                      <button
                        className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => openComplaintModal(order.id)}
                      >
                        Add Complaint
                      </button>
                    ) : (
                      <button
                        className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors inline-block"
                        onClick={() => setViewComplaintId(order.complaint_id!)}
                      >
                        View Complaint
                      </button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      </Layout>
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={closeComplaintModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Add Complaint</h3>
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={complaintTitle}
                  onChange={e => setComplaintTitle(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={complaintDescription}
                  onChange={e => setComplaintDescription(e.target.value)}
                  required
                  maxLength={500}
                  rows={4}
                />
              </div>
              {complaintError && <div className="text-red-600 text-sm">{complaintError}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                disabled={complaintLoading}
              >
                {complaintLoading ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* View Complaint Modal */}
      <ComplaintViewModal
        complaintId={viewComplaintId}
        open={!!viewComplaintId}
        onClose={() => setViewComplaintId(null)}
      />
    </div>
  )
}
