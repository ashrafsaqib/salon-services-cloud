"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Youtube, Facebook, MessageCircle } from "lucide-react"

interface StaffReview {
  id: number
  user_name: string
  content: string
  rating: number
  created_at: string
}

interface StaffDetail {
  id: number
  name: string
  image: string
  sub_title?: string
  about?: string
  phone?: string
  whatsapp?: string
  facebook?: string
  instagram?: string
  youtube?: string
  snapchat?: string
  tiktok?: string
  location?: string
  charges?: string
  commission?: string
  fix_salary?: string
  online?: number
  get_quote?: number
  quote_amount?: string | null
  show_quote_detail?: number
  services: any[]
  categories: any[]
  reviews: StaffReview[]
}

export default function StaffDetailPage() {
  const searchParams = useSearchParams()
  const staffId = searchParams.get("staff")
  const [staff, setStaff] = useState<StaffDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!staffId) return
    setLoading(true)
    fetch(`http://localhost:4000/api/staff?staff=${staffId}`)
      .then(res => res.json())
      .then(data => {
        setStaff(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [staffId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error || !staff) return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load staff details.</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-0 overflow-hidden">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-8 items-center bg-gradient-to-r from-rose-50 to-blue-50 p-8 border-b">
            <Image
              src={`/img/staff-images/${staff.image}`}
              alt={staff.name || `Staff #${staff.id}`}
              width={180}
              height={180}
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1 text-gray-900">{staff.name || `Staff #${staff.id}`}</h1>
              {staff.sub_title && <div className="text-lg text-rose-600 font-medium mb-2">{staff.sub_title}</div>}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {staff.online === 1 && <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Online</span>}
                {staff.location && <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{staff.location}</span>}
                {staff.charges && <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">AED {staff.charges} / service</span>}
              </div>
              <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600 mb-2">
                {staff.phone && <span>📞 <a href={`tel:${staff.phone}`} className="underline hover:text-blue-600">{staff.phone}</a></span>}
                {staff.whatsapp && (
                  <span className="flex items-center gap-1">
                    <img src="/whatsapp.svg" alt="WhatsApp" className="h-4 w-4 inline" />
                    <a href={`https://wa.me/${staff.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600">WhatsApp</a>
                  </span>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                {staff.facebook && (
                  <a href={staff.facebook} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform flex items-center gap-1 text-blue-600">
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </a>
                )}
                {staff.instagram && <a href={staff.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><img src="/instagram.svg" alt="Instagram" className="h-6 w-6" /></a>}
                {staff.youtube && (
                  <a href={staff.youtube} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform flex items-center gap-1 text-red-600">
                    <Youtube className="h-5 w-5" />
                    <span>YouTube</span>
                  </a>
                )}
                {staff.snapchat && <a href={staff.snapchat} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><img src="/snapchat.svg" alt="Snapchat" className="h-6 w-6" /></a>}
                {staff.tiktok && <a href={staff.tiktok} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><img src="/tiktok.svg" alt="TikTok" className="h-6 w-6" /></a>}
              </div>
            </div>
          </div>

          {/* About Section */}
          {staff.about && (
            <section className="px-8 py-6 border-b">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">About</h2>
              <div className="text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: staff.about }} />
            </section>
          )}

          {/* Categories & Services Section */}
          {(staff.categories?.length > 0 || staff.services?.length > 0) && (
            <section className="px-8 py-6 border-b grid grid-cols-1 md:grid-cols-2 gap-8">
              {staff.categories?.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {staff.categories.map((cat: any, idx: number) => (
                      <span key={idx} className="inline-block bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-medium">{cat.name || cat}</span>
                    ))}
                  </div>
                </div>
              )}
              {staff.services?.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {staff.services.map((svc: any, idx: number) => (
                      <span key={idx} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{svc.name || svc}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Quote Section */}
          {staff.get_quote === 1 && staff.show_quote_detail === 1 && (
            <section className="px-8 py-6 border-b">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Get a Quote</h2>
              <div className="text-gray-700 mb-1">This staff member accepts quote requests.</div>
              {staff.quote_amount && <div className="text-gray-700 font-medium">Quote Amount: <span className="text-blue-700">AED {staff.quote_amount}</span></div>}
            </section>
          )}

          {/* Compensation Section */}
          <section className="px-8 py-6 border-b">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Compensation</h2>
            <div className="flex flex-wrap gap-6 text-gray-700">
              <div>Commission: <span className="font-medium">{staff.commission ? `${staff.commission}%` : "N/A"}</span></div>
              <div>Fixed Salary: <span className="font-medium">{staff.fix_salary ? `AED ${staff.fix_salary}` : "N/A"}</span></div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="px-8 py-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Reviews</h2>
            {staff.reviews && staff.reviews.length > 0 ? (
              <div className="space-y-6">
                {staff.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2 text-gray-900">{review.user_name}</span>
                      <span className="text-yellow-500 text-lg">{'★'.repeat(review.rating)}</span>
                      <span className="ml-2 text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No reviews yet.</div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
