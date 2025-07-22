"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WhatsappFloatingButton } from "@/components/ui/whatsapp-floating-button";

export function Footer({
  bottomPages = [],
  bottomCategories = [],
}: {
  bottomPages?: Array<{ name: string; slug: string }>;
  bottomCategories?: Array<{ title: string; slug: string }>;
}) {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWhatsappNumber(localStorage.getItem("whatsappNumber"));
    }
  }, []);
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Lipslay Marketplace"
                width={180}
                height={40}
                className="h-8 w-auto rounded-md shadow-lg bg-white"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop solution for all beauty, grooming, and automotive
              services at your doorstep.
            </p>
            <div className="flex space-x-4 items-center">
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
            </div>
            {whatsappNumber && (
              <div className="mt-2 font-semibold text-sm select-all">
                {whatsappNumber}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {bottomCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-gray-400 hover:text-white"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQs
                </Link>
              </li>
              {bottomPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/info/${page.slug}`}
                    className="text-gray-400 hover:text-white"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Lipslay Marketplace. All rights
            reserved.
          </p>
        </div>
      </div>
      <WhatsappFloatingButton />
    </footer>
  );
}
