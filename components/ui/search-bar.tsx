"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Clock, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
import type { Service } from "@/types"

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = "Search for services...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Service[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Debounce the search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 300)

  // Mock API call function (replace with real API later)
  const searchServices = async (searchQuery: string): Promise<Service[]> => {
    if (!searchQuery.trim()) return []
    const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
    if (!res.ok) throw new Error("Failed to fetch search results")
    const data = await res.json()
    return data.services || []
  }

  // Effect to handle search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim()) {
        setIsLoading(true)
        try {
          const searchResults = await searchServices(debouncedQuery)
          setResults(searchResults)
          setIsOpen(true)
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault()
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-12 py-4 text-lg bg-white/95 backdrop-blur-sm border-white/20 rounded-full shadow-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          {query && (
            <button type="button" onClick={handleClear} className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm text-gray-500">
                  Found {results.length} service{results.length !== 1 ? "s" : ""} for "{query}"
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {results.map((service) => (
                  <div key={service.id} className="block hover:bg-gray-50 transition-colors">
                    <div className="p-4 flex items-center space-x-4">
                      <Link
                        href={`/services/${service.slug}`}
                        onClick={handleResultClick}
                        className="flex items-center space-x-4 flex-1 min-w-0"
                      >
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{service.name}</h3>
                          <p className="text-sm text-gray-500 mb-1">{service.category}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {service.duration}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              At your location
                            </div>
                            <div className="flex items-center font-bold text-rose-600">
                              {service.price}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={handleResultClick}>
                  <Button variant="outline" className="w-full">
                    View all results for "{query}"
                  </Button>
                </Link>
              </div>
            </>
          ) : query.trim() && !isLoading ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500 mb-2">No services found for "{query}"</p>
              <p className="text-sm text-gray-400 mb-4">Try searching for "haircut", "facial", or "car wash"</p>
              <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={handleResultClick}>
                <Button variant="outline" size="sm">
                  Search all services
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
