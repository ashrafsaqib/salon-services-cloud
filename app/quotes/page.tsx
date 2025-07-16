"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "@/components/layout/layout"
import { checkToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Loading from "../loading";

interface Quote {
  id: number;
  status: string;
  user_name: string;
  date_created: string;
  sourcing_quantity: number;
  service_image: string;
  service_name?: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = checkToken(router)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quotes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch quotes");
        return res.json();
      })
      .then((data) => {
        setQuotes(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {error ? (
            <div className="p-8 text-center text-rose-500">
              <p>⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-md hover:bg-rose-200 transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-rose-600">
                  Your Quotes
                </h1>
                <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm">
                  {quotes.length} {quotes.length === 1 ? "quote" : "quotes"}
                </span>
              </div>
              {quotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">✨</div>
                  <p className="text-gray-500">No quotes found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Create your first quote to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex-shrink-0 relative group">
                          <div className="absolute -top-3 -left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-full z-10">
                            #{q.id}
                          </div>
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                            <Image
                              src={q.service_image}
                              alt="Service"
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {q.service_name || "Custom Service"}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {q.user_name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  Qty: {q.sourcing_quantity}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  q.status === "Complete"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {q.status}
                              </span>
                              <div className="flex gap-2">
                                <a
                                  href={`/quotes/${q.id}`}
                                  className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-medium hover:bg-rose-700 transition"
                                >
                                  View
                                </a>
                                <a
                                  href={`/quotes/${q.id}/bids`}
                                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium hover:bg-gray-50 transition"
                                >
                                  Bids
                                </a>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(q.date_created).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      </Layout>
    </div>
  );
}
