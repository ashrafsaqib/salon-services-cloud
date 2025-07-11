"use client"

import React, { useEffect, useState } from "react"
import Layout from "@/components/layout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ComplaintViewModal } from "@/components/complaint/ComplaintViewModal"

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

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [complaintDetail, setComplaintDetail] = useState<ComplaintDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [chatText, setChatText] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setComplaints(data)
        } else if (data && Array.isArray(data.complaints)) {
          setComplaints(data.complaints)
        } else {
          setComplaints([])
        }
      })
      .catch(() => setError("Failed to load complaints"))
      .finally(() => setLoading(false))
  }, [])

  const handleView = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setDetailLoading(true)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${complaint.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setComplaintDetail(data))
      .catch(() => setComplaintDetail(null))
      .finally(() => setDetailLoading(false))
  }

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedComplaint || !chatText.trim()) return
    setChatLoading(true)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ complaint_id: selectedComplaint.id, text: chatText })
      })
      setChatText("")
      // Reload complaint detail/chat
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${selectedComplaint.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setComplaintDetail(data)
    } catch {
      // Optionally show error
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Complaints</h2>
          {loading ? (
            <div className="text-gray-500">Loading complaints...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">✨</div>
              <div className="text-gray-500">No complaints found.</div>
              <p className="text-gray-400 text-sm mt-1">
                Create your first complaint to get started
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {complaints.map(complaint => (
                <Card key={complaint.id}>
                  <CardContent className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <div className="font-semibold text-lg">{complaint.title}</div>
                      <div className="text-gray-700 text-sm mb-1">{complaint.description}</div>
                      <div className="text-xs text-gray-500">Status: {complaint.status}</div>
                      <div className="text-xs text-gray-500">Order ID: {complaint.order_id}</div>
                      <div className="text-xs text-gray-500">Created: {new Date(complaint.created_at).toLocaleString()}</div>
                    </div>
                    <Button onClick={() => setSelectedComplaint(complaint)} className="bg-blue-600 hover:bg-blue-700 text-white mt-2 md:mt-0">View</Button>
                  </CardContent>
                </Card>
              ))}
            </ul>
          )}
        </div>

        {/* Complaint Detail Modal */}
        <ComplaintViewModal
          complaintId={selectedComplaint ? selectedComplaint.id : null}
          open={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      </main>
      </Layout>
    </div>
  )
}
