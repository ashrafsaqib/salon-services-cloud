"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { checkToken } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"

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

interface ComplaintViewModalProps {
  complaintId: number | null
  open: boolean
  onClose: () => void
}

export const ComplaintViewModal: React.FC<ComplaintViewModalProps> = ({ complaintId, open, onClose }) => {
  const [complaintDetail, setComplaintDetail] = useState<ComplaintDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [chatText, setChatText] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (!open || !complaintId) return
    setLoading(true)
    setComplaintDetail(null)
    const token = checkToken(router)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${complaintId}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setComplaintDetail(data))
      .catch(() => setComplaintDetail(null))
      .finally(() => setLoading(false))
  }, [complaintId, open])

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!complaintId || !chatText.trim()) return
    setChatLoading(true)
    const token = checkToken(router)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ complaint_id: complaintId, text: chatText })
      })
      setChatText("")
      // Reload complaint detail/chat
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints/${complaintId}`, {
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

  if (!open) return null

  if (loading) {
    return <Loading />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        { complaintDetail ? (
          <>
            <h3 className="text-xl font-bold mb-2">{complaintDetail.title}</h3>
            <div className="mb-2 text-gray-700">{complaintDetail.description}</div>
            <div className="mb-2 text-xs text-gray-500">Status: {complaintDetail.status}</div>
            <div className="mb-2 text-xs text-gray-500">Order ID: {complaintDetail.order_id}</div>
            <div className="mb-4 text-xs text-gray-500">Created: {new Date(complaintDetail.created_at).toLocaleString()}</div>
            <hr className="my-4" />
            <h4 className="text-lg font-semibold mb-2">Complaints Conversation</h4>
            {complaintDetail.chats && complaintDetail.chats.length > 0 ? (
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
          </>
        ) : (
          <div className="text-gray-500">Complaint not found.</div>
        )}
      </div>
    </div>
  )
}
