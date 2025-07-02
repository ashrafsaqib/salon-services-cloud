"use client"

import React, { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      .then(data => setComplaints(data))
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

  const closeModal = () => {
    setSelectedComplaint(null)
    setComplaintDetail(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Complaints</h2>
          {loading ? (
            <div className="text-gray-500">Loading complaints...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : complaints.length === 0 ? (
            <div className="text-gray-500">No complaints found.</div>
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
                    <Button onClick={() => handleView(complaint)} className="bg-blue-600 hover:bg-blue-700 text-white mt-2 md:mt-0">View</Button>
                  </CardContent>
                </Card>
              ))}
            </ul>
          )}
        </div>

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-2">{selectedComplaint.title}</h3>
              <div className="mb-2 text-gray-700">{selectedComplaint.description}</div>
              <div className="mb-2 text-xs text-gray-500">Status: {selectedComplaint.status}</div>
              <div className="mb-2 text-xs text-gray-500">Order ID: {selectedComplaint.order_id}</div>
              <div className="mb-4 text-xs text-gray-500">Created: {new Date(selectedComplaint.created_at).toLocaleString()}</div>
              <hr className="my-4" />
              <h4 className="text-lg font-semibold mb-2">Complaints Conversation</h4>
              {detailLoading ? (
                <div className="text-gray-500">Loading chat...</div>
              ) : complaintDetail && complaintDetail.chats && complaintDetail.chats.length > 0 ? (
                <ul className="space-y-3 mb-2">
                  {complaintDetail.chats.map(chat => (
                    <li
                      key={chat.id}
                      className={
                        chat.self
                          ? "bg-blue-100 rounded p-3 text-sm ml-16 text-right flex flex-col items-end"
                          : "bg-gray-100 rounded p-3 text-sm mr-16"
                      }
                    >
                      <div>{chat.text}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(chat.created_at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No chat messages yet.</div>
              )}
              {/* Chat input form */}
              <form onSubmit={handleSendChat} className="flex gap-2 mt-4">
                <input
                  type="text"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  placeholder="Type your message..."
                  value={chatText}
                  onChange={e => setChatText(e.target.value)}
                  disabled={chatLoading}
                  maxLength={500}
                  required
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={chatLoading || !chatText.trim()}>
                  {chatLoading ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
