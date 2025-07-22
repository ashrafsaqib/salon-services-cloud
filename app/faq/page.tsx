"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/layout/layout"
import { FAQSection } from "@/components/sections/faq-section"
import Loading from "../loading"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface FAQ {
  question: string
  answer: string
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/faqs`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(setFaqs)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load FAQs.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>
      <FAQSection faqs={filteredFaqs} />
      </Layout>
    </div>
  )
}
