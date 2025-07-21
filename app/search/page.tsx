"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Layout from "@/components/layout/layout"
import { useDebounce } from "@/hooks/use-debounce"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

import type { Service } from "@/types"
import { ServiceCard } from "@/components/common/service-card"

// Fetch services from API
const searchServices = async (searchQuery: string): Promise<Service[]> => {
  if (!searchQuery.trim()) return []
  let zoneId = '';
  if (typeof window !== 'undefined') {
    zoneId = localStorage.getItem('selected_zone_id') || '';
  }
  const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery.trim())}${zoneId ? `&zoneId=${encodeURIComponent(zoneId)}` : ''}`)
  if (!res.ok) throw new Error("Failed to fetch search results")
  const data = await res.json()
  return data.services || []
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [isLoading, setIsLoading] = useState(false)
  const [allResults, setAllResults] = useState<Service[]>([])

  const debouncedQuery = useDebounce(query, 300)

  // Fetch results when query changes
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const results = await searchServices(debouncedQuery)
        setAllResults(results)
      } catch (error) {
        setAllResults([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchResults()
  }, [debouncedQuery])

  // No category filtering, just return all results
  const filteredAndSortedResults = useMemo(() => {
    return allResults
  }, [allResults])

  const clearFilters = () => {
    setQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>

      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {query ? `Search Results for "${query}"` : "All Services"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isLoading ? "Searching..." : `${filteredAndSortedResults.length} services found`}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && (
              <>
                {filteredAndSortedResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedResults.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                      /> 
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                    <p className="text-gray-600 mb-4">
                      {query
                        ? `No services match your search for "${query}".`
                        : "No services found."}
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear search
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      </Layout>
    </div>
  )
}
