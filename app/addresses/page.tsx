"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/layout/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { checkToken } from "@/lib/auth"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    buildingName: "",
    area: "",
    landmark: "",
    flatVilla: "",
    street: "",
    city: "",
    district: ""
  })
  const [zones, setZones] = useState<{ id: number; name: string }[]>([])
  const [formError, setFormError] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const router = useRouter()
  // Fetch zones for dropdown
  useEffect(() => {
    async function fetchZones() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/zones`)
        if (!res.ok) throw new Error("Failed to fetch zones")
        const data = await res.json()
        setZones(data.zones || [])
      } catch {
        setZones([])
      }
    }
    fetchZones()
  }, [])

  // Move fetchAddresses to function scope so it can be reused
  const fetchAddresses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/addresses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (!res.ok) throw new Error("Failed to fetch addresses")
      const data = await res.json()
      setAddresses(data)
    } catch (err: any) {
      setError(err.message || "Failed to load addresses")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!checkToken(router)) return;
    fetchAddresses()
  }, [router])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    if (!checkToken(router)) return;
    e.preventDefault()
    setFormError("")
    setFormLoading(true)
    try {
      const payload: any = { ...form }
      if (editingId) payload.address_id = editingId
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/saveaddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error("Failed to save address")
      setShowForm(false)
      setEditingId(null)
      setForm({
        buildingName: "",
        area: "",
        landmark: "",
        flatVilla: "",
        street: "",
        city: "",
        district: ""
      })
      await fetchAddresses()
    } catch (err: any) {
      setFormError(err.message || "Failed to save address")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (addr: any) => {
    setEditingId(addr.id)
    setForm({
      buildingName: addr.buildingName || "",
      area: addr.area || "",
      landmark: addr.landmark || "",
      flatVilla: addr.flatVilla || "",
      street: addr.street || "",
      city: addr.city || "",
      district: addr.district || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!checkToken(router)) return;
    if (!window.confirm("Are you sure you want to delete this address?")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deleteaddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ address_id: id })
      })
      if (!res.ok) throw new Error("Failed to delete address")
      await fetchAddresses()
    } catch (err: any) {
      alert(err.message || "Failed to delete address")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
      <main className="flex-1 flex flex-col items-center bg-gray-50 py-12">
        <Card className="w-full max-w-3xl mx-auto mb-8">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Saved Addresses</h2>
              <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ buildingName: "", area: "", landmark: "", flatVilla: "", street: "", city: "", district: "" }) }} className="bg-rose-600 hover:bg-rose-700">Add Address</Button>
            </div>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : addresses.length === 0 ? (
              <div className="text-gray-500">No addresses saved yet.</div>
            ) : (
              <ul className="space-y-4">
                {addresses.map((addr: any, idx: number) => (
                  <li key={addr.id} className="border rounded p-4 bg-white relative">
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(addr)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(addr.id)}>Delete</Button>
                    </div>
                    <div className="font-semibold text-lg mb-1">{addr.buildingName}</div>
                    <div className="text-sm text-gray-700 mb-1">Area: {addr.area}</div>
                    <div className="text-sm text-gray-700 mb-1">Landmark: {addr.landmark}</div>
                    <div className="text-sm text-gray-700 mb-1">Flat/Villa: {addr.flatVilla}</div>
                    <div className="text-sm text-gray-700 mb-1">Street: {addr.street}</div>
                    <div className="text-sm text-gray-700 mb-1">City: {addr.city}</div>
                    <div className="text-sm text-gray-700 mb-1">District: {addr.district}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Popup Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Address" : "Add New Address"}</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Building Name</label>
                  <Input name="buildingName" value={form.buildingName} onChange={handleFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area</label>
                  <select
                    name="area"
                    value={form.area}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select Area</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.name}>{zone.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Landmark</label>
                  <Input name="landmark" value={form.landmark} onChange={handleFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Flat/Villa</label>
                  <Input name="flatVilla" value={form.flatVilla} onChange={handleFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <Input name="street" value={form.street} onChange={handleFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input name="city" value={form.city} onChange={handleFormChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">District</label>
                  <Input name="district" value={form.district} onChange={handleFormChange} />
                </div>
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={formLoading}>
                  {formLoading ? (editingId ? "Saving..." : "Saving...") : (editingId ? "Save Changes" : "Save Address")}
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
      </Layout>
    </div>
  )
}
