"use client"

import React from "react"
import { useEffect, useState } from "react"
import Layout from "@/components/layout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PhoneInputWithCountry from "@/components/ui/phone-input-with-country"
import { useRouter } from "next/navigation"
import { checkToken } from "@/lib/auth"

export default function EditProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    affiliate: "",
    gender: "Male"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!checkToken(router)) return;
  }, [router])

  useEffect(() => {
    // Fetch user profile (replace with real API and auth)
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getprofile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          affiliate: data.affiliate || "",
          gender: data.gender || "Male"
        })
      } catch (err: any) {
        setError(err.message || "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!checkToken(router)) return;
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/setprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp,
          affiliate: form.affiliate,
          gender: form.gender
        })
      })
      if (!res.ok) throw new Error("Profile update failed")
      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "Profile update failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-lg mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Name</label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Email Address</label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Phone Number</label>
                <div className="flex gap-2">
                  <PhoneInputWithCountry
                    value={form.phone}
                    onChange={(value: string) =>
                      setForm(prev => ({ ...prev, phone: value.startsWith('+') ? value : `+${value}` }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Whatsapp</label>
                <div className="flex gap-2">
                  <PhoneInputWithCountry
                    value={form.whatsapp}
                    onChange={(value: string) =>
                      setForm(prev => ({ ...prev, whatsapp: value.startsWith('+') ? value : `+${value}` }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Affiliate Code</label>
                <Input name="affiliate" value={form.affiliate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Gender</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-1">
                    <Input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} required />
                    Male
                  </label>
                  <label className="flex items-center gap-1">
                    <Input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} required />
                    Female
                  </label>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm font-medium text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm font-medium text-center">{success}</div>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      </Layout>
    </div>
  )
}
