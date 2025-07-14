"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  MessageCircle,
  ChevronRight,
  Calendar,
  Package,
  Info,
} from "lucide-react";
import Layout from "@/components/layout/layout"
import { checkToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface QuoteOption {
  id: number;
  name: string;
  price: string;
}

interface QuoteDetail {
  id: number;
  user_name: string;
  phone: string;
  whatsapp: string;
  location: string;
  detail: string;
  status: string;
  sourcing_quantity: number;
  service_name: string;
  service_image: string;
  quote_images: string[];
  quote_options: QuoteOption[];
  created_at: string;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    if (!id) return;
    const token = checkToken(router)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quote/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch quote detail");
        return res.json();
      })
      .then((data) => {
        setQuote(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Layout>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="text-gray-500 text-center py-16">
              Loading your quote...
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-rose-100">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mb-4">
                <span className="text-rose-600">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Try Again
              </button>
            </div>
          ) : !quote ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Info className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Quote not found
              </h3>
              <p className="text-gray-500">
                The quote you're looking for doesn't exist
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Quote Details
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(quote.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      quote.status === "Complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {quote.status}
                  </span>
                  <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
                    #{quote.id}
                  </span>
                </div>
              </div>

              {/* Main Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Service Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 relative">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <Image
                            src={quote.service_image}
                            alt={quote.service_name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {quote.service_name}
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                            <Package className="h-4 w-4" />
                            <span>Qty: {quote.sourcing_quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-600 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      Customer Information
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{quote.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">WhatsApp</p>
                          <p className="font-medium">{quote.whatsapp}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            {quote.location || "Not specified"}
                          </p>
                        </div>
                        {quote.location && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              quote.location
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-600 hover:text-rose-700"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-600 p-2 rounded-full">
                        <Info className="h-4 w-4" />
                      </span>
                      Additional Details
                    </h2>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {quote.detail || (
                        <p className="text-gray-400 italic">
                          No additional details provided
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Options Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-600 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </span>
                      Quote Options
                    </h2>
                    {quote.quote_options && quote.quote_options.length > 0 ? (
                      <ul className="space-y-3">
                        {quote.quote_options.map((opt) => (
                          <li
                            key={opt.id}
                            className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-medium text-gray-800">
                              {opt.name}
                            </span>
                            <span className="font-bold text-rose-600">
                              AED {opt.price}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        No options available
                      </div>
                    )}
                  </div>

                  {/* Gallery Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-600 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </span>
                      Image Gallery
                    </h2>
                    {quote.quote_images && quote.quote_images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {quote.quote_images.map((img, idx) => (
                          <div
                            key={idx}
                            className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 hover:border-rose-300 transition-colors"
                          >
                            <Image
                              src={img}
                              alt={`Quote Image ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        No images available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      </Layout>
    </div>
  );
}
