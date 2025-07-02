"use client"
import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

function FlashMessage() {
  const [message, setMessage] = useState("")
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const msg = sessionStorage.getItem("flashMessage")
      if (msg) {
        setMessage(msg)
        setVisible(true)
        sessionStorage.removeItem("flashMessage")
      }
    }
  }, [])
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [visible])
  if (!message || !visible) return null
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow z-50 transition-opacity duration-500">
      {message}
    </div>
  )
}

export function Header() {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  interface Subcategory {
    id: number
    title: string
    href: string
    image: string
  }

  interface Category {
    id: number
    title: string
    slug: string
    image: string
    subcategories?: Subcategory[]
  }

  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const categoriesMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"))
    }
  }, [])

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch categories when menu is opened
  useEffect(() => {
    if (isCategoriesMenuOpen && categories.length === 0) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(() => setCategories([]))
    }
  }, [isCategoriesMenuOpen])

  // Close slide-in menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (isCategoriesMenuOpen && categoriesMenuRef.current && !categoriesMenuRef.current.contains(e.target as Node)) {
        setIsCategoriesMenuOpen(false)
      }
    }
    if (isCategoriesMenuOpen) {
      document.addEventListener("mousedown", handleClick)
    } else {
      document.removeEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isCategoriesMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem("token")
    // Set a flash message in sessionStorage
    sessionStorage.setItem("flashMessage", "You have been logged out.")
    window.location.href = "/"
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <FlashMessage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Lipslay Marketplace" width={180} height={40} className="h-8 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              className="text-gray-600 hover:text-gray-900 font-medium focus:outline-none"
              onClick={() => setIsCategoriesMenuOpen(true)}
            >
              Services Categories
            </button>
            {/* Slide-in Categories Menu (desktop trigger) */}
            {/* ...existing nav links... */}
            <Link href="/services/package" className="text-gray-600 hover:text-gray-900">
              Packages
            </Link>
            <Link href="/services/beauty-add-on" className="text-gray-600 hover:text-gray-900">
              Beauty Add-Ons
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsAccountMenuOpen(true)}
              onMouseLeave={() => setIsAccountMenuOpen(false)}
            >
              <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer py-2">
                <span>Account</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              {isAccountMenuOpen && (
                <div className="absolute top-full right-0 w-56 bg-white shadow-lg border rounded-lg py-2 z-50">
                  {!isLoggedIn && (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                        Login
                      </Link>
                      <Link href="/register" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                        Create Account
                      </Link>
                    </>
                  )}
                  {isLoggedIn && (
                    <>
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                        Edit Profile
                      </Link>
                      <Link href="/addresses" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                        Address Book
                      </Link>
                      <Link href="/complaints" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">
                        Complaints
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900">
              FAQs
            </Link>
            <Link href="/book">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                Book Now
              </Button>
            </Link>
            <Link href="/info/contact-us" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          {/* Hamburger for mobile */}
          <Button variant="ghost" className="md:hidden" onClick={() => setIsCategoriesMenuOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>

          {/* Slide-in Categories/Menu (shared for mobile and desktop) */}
          {isCategoriesMenuOpen && (
            <>
              {/* Animation style for slide-in-left */}
             
              <div ref={categoriesMenuRef} className="fixed inset-0 z-[100] flex">
  {/* Sidebar menu FIRST (on the left) */}
  <div className="relative h-full w-[350px] max-w-full bg-white shadow-lg p-6 overflow-y-auto animate-slide-in-left">
    <button
  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
  onClick={() => setIsCategoriesMenuOpen(false)}
  aria-label="Close"
>
  &times;
</button>
    <h2 className="text-xl font-bold mb-6 text-rose-600">Service Categories</h2>
    {categories.length === 0 ? (
      <div className="text-gray-500">Loading...</div>
    ) : (
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link href={`/services/${cat.slug}`} className="flex items-center gap-3 group">
              <span className="font-medium text-gray-900 group-hover:text-rose-600">{cat.title}</span>
            </Link>
            {cat.subcategories && cat.subcategories.length > 0 && (
              <ul className="ml-8 mt-2 space-y-2">
                {cat.subcategories.map((sub) => (
                  <li key={sub.id}>
                    <Link href={`/services/${sub.href}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-rose-600">
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    )}

    {/* Mobile-only nav links */}
    {isMobile && (
      <div className="mt-8 border-t pt-6 space-y-4">
        <Link href="/services/package" className="block text-gray-600 hover:text-gray-900 text-lg">Packages</Link>
        <Link href="/services/beauty-add-on" className="block text-gray-600 hover:text-gray-900 text-lg">Beauty Add-Ons</Link>
        <Link href="/faq" className="block text-gray-600 hover:text-gray-900 text-lg">FAQs</Link>
        <Link href="/book" className="block text-gray-600 hover:text-gray-900 text-lg">Book Now</Link>
        <Link href="/info/contact-us" className="block text-gray-600 hover:text-gray-900 text-lg">Contact</Link>
        <div className="mt-4">
          <div className="font-semibold text-gray-900 mb-2">Account</div>
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">Login</Link>
              <Link href="/register" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">Create Account</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">Dashboard</Link>
              <Link href="/profile" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">Edit Profile</Link>
              <Link href="/addresses" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">Address Book</Link>
              <Link href="/complaints" className="block px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50">Complaints</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    )}
  </div>

  {/* Overlay comes AFTER (on the right) */}
  <div className="bg-black bg-opacity-40 w-full h-full" onClick={() => setIsCategoriesMenuOpen(false)} />
</div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
