"use client"
import React, { useEffect, useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [infoPages, setInfoPages] = useState({
    topPages: [],
    bottomPages: [],
    bottomCategories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/information-pages`)
      .then((res) => res.json())
      .then((data) => {
        setInfoPages(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header topPages={infoPages.topPages} />
      <main className="flex-1">{children}</main>
      <Footer bottomPages={infoPages.bottomPages} bottomCategories={infoPages.bottomCategories} />
    </div>
  );
}
