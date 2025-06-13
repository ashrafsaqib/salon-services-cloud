"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Plus, Minus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)
  const pathname = usePathname()
  const isFaqsPage = pathname === "/faq"

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services and booking process
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Collapsible
              key={index}
              open={openFAQ === index}
              onOpenChange={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              <Card className="overflow-hidden">
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="text-left font-semibold text-gray-900">{faq.question}</h3>
                      {openFAQ === index ? (
                        <Minus className="h-5 w-5 text-rose-600 flex-shrink-0" />
                      ) : (
                        <Plus className="h-5 w-5 text-rose-600 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="px-6 pb-6 pt-0">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {!isFaqsPage && (
          <div className="text-center mt-10">
            <Link href="/faq">
              <Button className="bg-rose-600 hover:bg-rose-700">
                View All FAQs
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
