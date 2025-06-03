"use client"

import { useState } from "react"
import { Plus, Minus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const faqs = [
  {
    question: "How do I book a service?",
    answer:
      "You can book a service through our website by selecting your desired service, choosing your location, and picking a convenient time slot. You can also download our mobile app for easier booking on the go.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently serve major metropolitan areas and surrounding suburbs. You can check if we serve your area by entering your address during the booking process or contacting our customer service team.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 24-48 hours in advance to ensure availability. However, we also offer same-day bookings based on staff availability in your area.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer:
      "You can cancel or reschedule your appointment up to 4 hours before the scheduled time without any charges. Cancellations within 4 hours may incur a small fee.",
  },
  {
    question: "Are your staff members licensed and insured?",
    answer:
      "Yes, all our professionals are fully licensed, insured, and background-checked. We ensure they meet the highest standards of safety and professionalism.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and digital payment methods including Apple Pay, Google Pay, and PayPal. Payment is processed securely through our platform.",
  },
]

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

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

        <div className="text-center mt-10">
          <Button className="bg-rose-600 hover:bg-rose-700">
            View All FAQs
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
