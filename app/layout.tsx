import type React from "react"
import CacheInit from "@/components/CacheInit"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import CustomHead from "./custom-head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lipslay Marketplace - Beauty & Salon Services at Your Doorstep",
  description:
    "Book beauty, salon, and automotive services delivered right to your doorstep. Professional services, easy booking, and convenient scheduling.",
  generator: "v0.dev",
}

async function getCustomAssets() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/layout-data`, {
    cache: "no-store",
  })
  if (!res.ok) return { headTag: "", footerTag: "" }
  return res.json()
}

function stripScriptTags(script: string) {
  return script.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "");
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { headTag, footerTag } = await getCustomAssets()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <CustomHead headTag={headTag} />
      </head>
      <body className={inter.className}>
        <CacheInit>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </CacheInit>

        <Script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />

        {footerTag && (
          <Script id="custom-footer" strategy="afterInteractive">
            {stripScriptTags(footerTag)}
          </Script>
        )}
      </body>
    </html>
  )
}
