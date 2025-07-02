"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const countryCode = "+971"

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
    phone: "",
    whatsapp: "",
    affiliate: "",
    gender: "Male"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          number: countryCode + form.phone,
          whatsapp: countryCode + form.whatsapp,
          affiliate: form.affiliate,
          gender: form.gender
        })
      })
      if (!res.ok) throw new Error("Registration failed")
      setSuccess("Registration successful! Please login.")
      sessionStorage.setItem("flashMessage", "Successfully Registered")
      setTimeout(() => router.push("/login"), 1500)
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-lg mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
                <label className="block text-sm font-medium mb-1 text-rose-600">*Password</label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Confirm Password</label>
                <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Phone Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center bg-gray-100 border border-gray-200 rounded px-2 text-sm">🇦🇪 {countryCode}</span>
                  <Input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="050 123 4567" required className="flex-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-rose-600">*Whatsapp whatsapp</label>
                <div className="flex gap-2">
                  <span className="flex items-center bg-gray-100 border border-gray-200 rounded px-2 text-sm">🇦🇪 {countryCode}</span>
                  <Input name="whatsapp" type="tel" value={form.whatsapp} onChange={handleChange} placeholder="050 123 4567" required className="flex-1" />
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
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
