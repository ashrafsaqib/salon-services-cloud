"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/layout/layout";
import { FAQSection } from "@/components/sections/faq-section";
import Loading from "../loading";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FAQ {
  question: string;
  answer: string;
  category_id: number;
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<{ id: number; title: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id");

  useEffect(() => {
    let url = `${API_BASE_URL}/api/faqs`;
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setFaqs(data.faqs || []);
        setCategories(data.categories || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [categoryId]);

  // Filter by search
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load FAQs.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-8 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          {/* FAQ by Category Section */}
          {categoryId ? (
            <div className="mb-8">
              <a
                href="/faq"
                className="inline-block px-4 py-2 rounded bg-gray-100 hover:bg-rose-100 text-gray-700 font-medium border border-gray-200 mb-2"
              >
                All FAQs
              </a>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">FAQ by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/faq?category_id=${cat.id}`}
                    className={`px-4 py-2 rounded bg-gray-100 hover:bg-rose-100 text-gray-700 font-medium border ${
                      categoryId == String(cat.id)
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-200"
                    }`}
                  >
                    {cat.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <FAQSection faqs={filteredFaqs} />
      </Layout>
    </div>
  );
}
