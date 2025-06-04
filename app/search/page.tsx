"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, X, Star, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useDebounce } from "@/hooks/use-debounce"

interface Service {
  id: number
  name: string
  category: string
  categorySlug: string
  serviceSlug: string
  price: string
  duration: string
  description: string
  image: string
  keywords: string[]
}

const categories = [
  { name: "All Categories", value: "all" },
  { name: "Ladies Salon", value: "ladies-salon" },
  { name: "Gents Salon", value: "gents-salon" },
  { name: "Automotive", value: "automotive" },
]

const priceRanges = [
  { name: "All Prices", value: "all" },
  { name: "Under $30", value: "0-30" },
  { name: "$30 - $50", value: "30-50" },
  { name: "$50 - $80", value: "50-80" },
  { name: "Over $80", value: "80+" },
]

const sortOptions = [
  { name: "Relevance", value: "relevance" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Duration: Short to Long", value: "duration-asc" },
  { name: "Duration: Long to Short", value: "duration-desc" },
]

// Fetch services from API
const searchServices = async (searchQuery: string): Promise<Service[]> => {
  if (!searchQuery.trim()) return []
  const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
  if (!res.ok) throw new Error("Failed to fetch search results")
  const data = await res.json()
  return data.services || []
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)
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

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = allResults

    // Filter by categories
    if (!selectedCategories.includes("all")) {
      filtered = filtered.filter((service) => selectedCategories.includes(service.categorySlug))
    }

    // Filter by price range
    if (selectedPriceRange !== "all") {
      filtered = filtered.filter((service) => {
        const price = Number.parseInt(service.price.replace("$", ""))
        switch (selectedPriceRange) {
          case "0-30":
            return price < 30
          case "30-50":
            return price >= 30 && price <= 50
          case "50-80":
            return price >= 50 && price <= 80
          case "80+":
            return price > 80
          default:
            return true
        }
      })
    }

    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number.parseInt(a.price.replace("$", "")) - Number.parseInt(b.price.replace("$", ""))
        case "price-desc":
          return Number.parseInt(b.price.replace("$", "")) - Number.parseInt(a.price.replace("$", ""))
        case "duration-asc":
          return Number.parseInt(a.duration.replace(" min", "")) - Number.parseInt(b.duration.replace(" min", ""))
        case "duration-desc":
          return Number.parseInt(b.duration.replace(" min", "")) - Number.parseInt(a.duration.replace(" min", ""))
        default:
          return 0 // relevance (keep original order)
      }
    })

    return sorted
  }, [allResults, selectedCategories, selectedPriceRange, sortBy])

  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    if (categoryValue === "all") {
      setSelectedCategories(checked ? ["all"] : [])
    } else {
      setSelectedCategories((prev) => {
        const newCategories = checked
          ? [...prev.filter((cat) => cat !== "all"), categoryValue]
          : prev.filter((cat) => cat !== categoryValue)

        return newCategories.length === 0 ? ["all"] : newCategories
      })
    }
  }

  const clearFilters = () => {
    setSelectedCategories(["all"])
    setSelectedPriceRange("all")
    setSortBy("relevance")
  }

  const activeFiltersCount =
    (selectedCategories.includes("all") ? 0 : selectedCategories.length) + (selectedPriceRange === "all" ? 0 : 1)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 md:w-auto w-full"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg md:hidden">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${category.value}`}
                          checked={selectedCategories.includes(category.value)}
                          onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                        />
                        <label htmlFor={`mobile-${category.value}`} className="text-sm">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={selectedCategories.includes(category.value)}
                          onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                        />
                        <label htmlFor={category.value} className="text-sm cursor-pointer">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

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

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="hidden md:flex items-center gap-2">
                  {!selectedCategories.includes("all") && (
                    <div className="flex gap-1">
                      {selectedCategories.map((categorySlug) => {
                        const category = categories.find((cat) => cat.value === categorySlug)
                        return (
                          <Badge key={categorySlug} variant="secondary" className="flex items-center gap-1">
                            {category?.name}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleCategoryChange(categorySlug, false)}
                            />
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                  {selectedPriceRange !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {priceRanges.find((range) => range.value === selectedPriceRange)?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPriceRange("all")} />
                    </Badge>
                  )}
                </div>
              )}
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
                      <Link href={`/services/${service.categorySlug}/${service.serviceSlug}`} key={service.id}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <div className="h-48 bg-gray-200 relative">
                            <Image
                              src={
                                service.image
                                  ? service.image
                                  : "/placeholder.svg"
                              }
                              alt={service.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{service.name}</h3>
                              <div className="flex items-center ml-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="text-sm">4.8</span>
                              </div>
                            </div>

                            <p className="text-sm text-rose-600 font-medium mb-2">{service.category}</p>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {service.duration}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                At your location
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-rose-600">{service.price}</span>
                              <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                                Book Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
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
                        ? `No services match your search for "${query}" with the current filters.`
                        : "No services match your current filters."}
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
