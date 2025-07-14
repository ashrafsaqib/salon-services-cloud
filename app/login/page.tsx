"use client"

import React, { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      router.push("/dashboard")
    }
    if (typeof window !== "undefined") {
      const msg = sessionStorage.getItem("loginMessage")
      if (msg) {
        setLoginMessage(msg)
        sessionStorage.removeItem("loginMessage")
      }
    }
  }, [router])

  useEffect(() => {
    if (loginMessage) {
      const timer = setTimeout(() => setLoginMessage("") , 3000)
      return () => clearTimeout(timer)
    }
  }, [loginMessage])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password
        })
      })
      if (!res.ok) throw new Error("Invalid credentials")
      const data = await res.json()
      if (data.token) {
        localStorage.setItem("token", data.token)
      }
      if (data.user) {
        localStorage.setItem("user_name", String(data.user.name))
        localStorage.setItem("user_email", String(data.user.email))
        localStorage.setItem("user_gender", String(data.user.gender))
        localStorage.setItem("user_number", String(data.user.number))
        localStorage.setItem("user_whatsapp", String(data.user.whatsapp))
        localStorage.setItem("user_id", String(data.user.id))
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("login_expiry", String(Date.now() + 3600 * 1000));
      }
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <main className="flex-1 flex items-center justify-center bg-gray-50 py-12">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
              {loginMessage && (
                <div className="mb-4 px-4 py-2 bg-green-100 border border-green-400 text-green-700 rounded shadow text-center animate-fade-in">
                  {loginMessage}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && <div className="text-red-600 text-sm font-medium text-center">{error}</div>}
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 h-12 text-lg" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </Layout>
    </div>
  )
}
