"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceCard } from "@/components/common/service-card"
import { useRouter } from "next/navigation"

interface Service {
  name: string;
  price: string;
  discount: string | null;
  rating: number | null;
  image: string;
  description: string;
  duration: string | null;
  slug: string;
}

interface FeaturedCategory {
  id: string;
  name: string;
  slug: string;
  services: Service[];
}

interface FeaturedServicesProps {
  featured: FeaturedCategory[];
}

export function FeaturedServices({ featured }: FeaturedServicesProps) {
  if (!featured || featured.length === 0) return null;
  const [activeTab, setActiveTab] = useState(featured[0]?.slug || "");
  const router = useRouter();

  return (
    <section className="py-16 bg-gray-50">
      <style jsx>{`
        /* Default: Hide scrollbar */
        .custom-scrollbar {
          scrollbar-width: none; /* Firefox */
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }

        /* On hover: Show slim rose scrollbar */
        .custom-scrollbar:hover {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: #f43f5e transparent; /* rose-600 */
        }
        .custom-scrollbar:hover::-webkit-scrollbar {
          display: block;
          height: 6px; /* slim scrollbar */
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #f43f5e; /* rose-600 */
          border-radius: 9999px; /* round */
        }
        .custom-scrollbar:hover::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly-rated services
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-friendly tabs with horizontal scroll */}
          <div
            className="overflow-x-auto w-full mb-8 custom-scrollbar"
            style={{ WebkitOverflowScrolling: "touch", overflowY: "hidden" }}
          >
            <TabsList className="flex min-w-max w-fit bg-white border border-gray-200 p-1 rounded-lg cursor-grab">
              {featured.map((category) => (
                <TabsTrigger
                  key={category.slug}
                  value={category.slug}
                  className="px-4 py-2 text-sm font-medium whitespace-nowrap data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {featured.map((category) => (
            <TabsContent key={category.slug} value={category.slug} className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                <button
                  className="text-rose-600 hover:underline text-sm font-medium px-3 py-1 rounded transition"
                  onClick={() => router.push(`/search?category=${category.id}`)}
                >
                  View all services
                </button>
              </div>
              <div
                className={`grid gap-6 ${
                  category.services.length === 1
                    ? "grid-cols-1 justify-items-center max-w-md mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {category.services.map((service, index) => (
                  <ServiceCard key={service.slug || index} service={service} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
