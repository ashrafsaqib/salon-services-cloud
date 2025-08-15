"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/layout";
import { useDebounce } from "@/hooks/use-debounce";
import * as Popover from "@radix-ui/react-popover";

import type { Service } from "@/types";
import { ServiceCard } from "@/components/common/service-card";
import * as Slider from "@radix-ui/react-slider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const searchServices = async (
  searchQuery: string,
  category: string,
  priceRange: [number, number],
  sortOrder: string
): Promise<Service[]> => {
  let zoneId = "";
  if (typeof window !== "undefined") {
    zoneId = localStorage.getItem("selected_zone_id") || "";
  }

  const queryParams = new URLSearchParams({
    q: searchQuery.trim(),
    category: category || "",
    min_price: priceRange[0].toString(),
    max_price: priceRange[1].toString(),
    sort: sortOrder || "",
    ...(zoneId ? { zoneId } : {}),
  });

  const res = await fetch(
    `${API_BASE_URL}/api/search?${queryParams.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch search results");
  const data = await res.json();
  return data.services || [];
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [allResults, setAllResults] = useState<Service[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );
  const [categorySearch, setCategorySearch] = useState("");

  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500]);
  const [sortOrder, setSortOrder] = useState("");

  const debouncedQuery = useDebounce(query, 300);
  const debouncedCategory = useDebounce(category, 300);
  const debouncedPriceRange = useDebounce(priceRange, 300);
  const debouncedSortOrder = useDebounce(sortOrder, 300);

  const loaderRef = useRef<HTMLDivElement>(null);
  const categoryListRef = useRef<HTMLDivElement>(null);

  const [categoryVisibleCount, setCategoryVisibleCount] = useState(20);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${API_BASE_URL}/api/categories/all`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const currentRequestId = ++requestIdRef.current;
      try {
        const results = await searchServices(
          debouncedQuery,
          debouncedCategory,
          debouncedPriceRange,
          debouncedSortOrder
        );
        if (requestIdRef.current === currentRequestId) {
          setAllResults(results);
        }
      } catch {
        if (requestIdRef.current === currentRequestId) {
          setAllResults([]);
        }
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setIsLoading(false);
        }
      }
    };
    fetchResults();
  }, [debouncedQuery, debouncedCategory, debouncedPriceRange, debouncedSortOrder]);

  useEffect(() => {
    setVisibleCount(20);
  }, [debouncedQuery, category, priceRange, sortOrder]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 20);
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, allResults]);

  useEffect(() => {
    setCategoryVisibleCount(20);
  }, [categorySearch]);

  useEffect(() => {
    if (!categoryListRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCategoryVisibleCount((prev) => prev + 20);
      }
    });
    const lastItem = categoryListRef.current.lastElementChild;
    if (lastItem) observer.observe(lastItem);
    return () => observer.disconnect();
  }, [categoryListRef, categorySearch, categories, categoryVisibleCount]);

  const filteredCategories = useMemo(
    () =>
      categories.filter((c) =>
        c.title.toLowerCase().includes(categorySearch.toLowerCase())
      ),
    [categories, categorySearch]
  );

  const filteredAndSortedResults = allResults;

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setPriceRange([50, 500]);
    setSortOrder("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
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

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div
            className="flex flex-col md:flex-row gap-4 md:gap-8"
            style={{ minHeight: "calc(100vh - 120px)" }}
          >
            <div className="w-full md:w-80 mb-4 md:mb-0">
              <div className="w-full md:w-80 bg-white p-4 sm:p-6 border rounded-xl shadow space-y-8 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-rose-400 align-middle">
                    category
                  </span>
                  Category
                </label>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button
                      className={`w-full border rounded px-3 py-2 text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-rose-200 ${
                        category
                          ? "bg-rose-50 border-rose-400 text-rose-700"
                          : "bg-gray-50 border-gray-300 text-gray-600"
                      } hover:border-rose-400 flex items-center justify-between`}
                    >
                      <span>
                        {category
                          ? categories.find((c) => c.id === category)?.title ||
                            "Select category"
                          : "Select category"}
                      </span>
                      <span className="material-icons text-base text-gray-400 ml-2">
                        expand_more
                      </span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Content
                    className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 w-72 z-50"
                    sideOffset={5}
                  >
                    <input
                      type="text"
                      placeholder="Search category..."
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                    <div
                      className="max-h-60 overflow-y-auto"
                      ref={categoryListRef}
                    >
                      <button
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded text-sm ${
                          category === ""
                            ? "bg-rose-50 text-rose-700 font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => {
                          setCategory("");
                          setCategorySearch("");
                        }}
                      >
                        {category === "" && (
                          <span className="material-icons text-rose-400 text-base">
                            check
                          </span>
                        )}
                        All
                      </button>
                      {filteredCategories
                        .slice(0, categoryVisibleCount)
                        .map((cat) => (
                          <button
                            key={cat.id}
                            className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded text-sm ${
                              category === cat.id
                                ? "bg-rose-400 text-white font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => {
                              setCategory(cat.id);
                              setCategorySearch("");
                            }}
                          >
                            {category === cat.id && (
                              <span className="material-icons text-white text-base">
                                check
                              </span>
                            )}
                            {cat.title}
                          </button>
                        ))}
                    </div>
                  </Popover.Content>
                </Popover.Root>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-yellow-400 align-middle">
                    attach_money
                  </span>
                  Price Range
                </label>
                <div className="px-2">
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={priceRange}
                    onValueChange={(value: number[]) =>
                      setPriceRange([value[0], value[1]])
                    }
                    min={0}
                    max={2000}
                    step={10}
                  >
                    <Slider.Track className="bg-gray-200 relative grow rounded-full h-[4px]">
                      <Slider.Range className="absolute bg-rose-400 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block w-5 h-5 bg-white border border-gray-300 rounded-full shadow hover:bg-rose-100 focus:outline-none"
                      aria-label="Minimum price"
                    />
                    <Slider.Thumb
                      className="block w-5 h-5 bg-white border border-gray-300 rounded-full shadow hover:bg-rose-100 focus:outline-none"
                      aria-label="Maximum price"
                    />
                  </Slider.Root>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>
                      {priceRange[0]}
                      <span className="ml-1 font-semibold align-middle">AED</span>
                    </span>
                    <span>
                      {priceRange[1]}
                      <span className="ml-1 font-semibold align-middle">AED</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <span className="material-icons text-blue-400 align-middle">sort</span>
                  Sort By
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full font-semibold py-2 border-rose-400 text-rose-700 hover:bg-rose-50 transition flex items-center justify-center gap-2"
              >
                <span className="material-icons text-rose-400">clear</span>
                Clear Filters
              </Button>
            </div>
            </div>

            <div className="flex-1 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {query ? `Search Results for "${query}"` : "All Services"}
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    {isLoading
                      ? "Searching..."
                      : `${filteredAndSortedResults.length} services found`}
                  </p>
                </div>
              </div>

              <div
                className="overflow-y-auto"
                style={{ flex: 1, height: "100%" }}
              >
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="animate-pulse">
                        <div className="h-40 sm:h-48 bg-gray-200"></div>
                        <CardContent className="p-3 sm:p-4">
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

                {!isLoading && (
                  <>
                    {filteredAndSortedResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredAndSortedResults
                          .slice(0, visibleCount)
                          .map((service) => (
                            <ServiceCard key={service.id} service={service} />
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <div className="text-gray-400 mb-4">
                          <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          No services found
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">
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

                {!isLoading && filteredAndSortedResults.length > 0 && (
                  <div ref={loaderRef} className="h-10"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
