"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/layout/layout"
import Loading from "@/app/loading";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface InfoPageData {
  title: string;
  content: string; // HTML or markdown rendered as HTML
  updatedAt?: string;
}

export default function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<InfoPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/info?slug=${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setPage)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <Loading />
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Page not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
          {page.updatedAt && (
            <div className="text-sm text-gray-500 mb-4">
              Last updated:{" "}
              {new Date(page.updatedAt).toLocaleDateString()}
            </div>
          )}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>
      </Layout>
    </div>
  );
}
