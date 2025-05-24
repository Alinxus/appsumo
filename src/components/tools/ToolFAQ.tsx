'use client'

import { useState } from 'react'

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
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about lifetime deals
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-500 transform transition-transform ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {openFAQ === index && (
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-blue-800 mb-6">
              Our support team is here to help you make the right decision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@aisumo.com"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 