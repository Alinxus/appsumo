'use client'

import { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ToolFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const faqs = [
    {
      question: "What does 'lifetime deal' mean?",
      answer: "A lifetime deal means you pay once and get access to the software for life. No monthly or yearly subscription fees ever. You'll receive all future updates and features included in your plan."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes! We offer a 60-day money-back guarantee. If you're not completely satisfied with your purchase, you can request a full refund within 60 days of purchase, no questions asked."
    },
    {
      question: "Will I get future updates?",
      answer: "Absolutely! Your lifetime deal includes all future updates and improvements to the software. You'll always have access to the latest version with new features as they're released."
    },
    {
      question: "Is commercial use allowed?",
      answer: "Yes, commercial use is included with your lifetime deal. You can use the software for client work, in your business, or any commercial projects without any additional licensing fees."
    },
    {
      question: "How do I access the software after purchase?",
      answer: "After completing your purchase, you'll receive instant access instructions via email. This typically includes download links, license keys, or account credentials depending on the software."
    },
    {
      question: "What if the company goes out of business?",
      answer: "While we carefully vet all our partners, if a company discontinues their software, we work to provide alternative solutions or refunds when possible. This is very rare as we only partner with established companies."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "The features included in your lifetime deal are fixed at the time of purchase. However, some vendors may offer upgrade options for additional features - check the specific tool's terms for details."
    },
    {
      question: "Is support included?",
      answer: "Yes! Most lifetime deals include ongoing customer support from the software vendor. The level of support (email, chat, phone) varies by vendor and is specified in each deal's details."
    }
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about lifetime deals
          </p>
        </div>

        <Accordion type="single" collapsible value={openFAQ !== null ? String(openFAQ) : undefined} onValueChange={v => setOpenFAQ(v !== undefined ? Number(v) : null)} className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={String(index)} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <AccordionTrigger className="px-8 py-6 text-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors">{faq.question}</AccordionTrigger>
              <AccordionContent className="px-8 pb-6 text-gray-700 leading-relaxed border-t border-gray-100">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <Card className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-700 mb-6">
                Our support team is here to help you make the right decision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="default">
                  <a
                    href="mailto:support@aisumo.com"
                    className="inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Support
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="/contact"
                    className="inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Live Chat
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 