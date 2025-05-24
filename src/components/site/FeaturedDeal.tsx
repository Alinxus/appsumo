'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface FeaturedDealProps {
  tool: {
    id: string
    name: string
    slug: string
    shortDescription: string | null
    regularPrice: any
    dealPrice: any | null
    discountPercentage: number | null
    dealEndsAt: Date | null
    images: string[]
    features: string[]
    category: { name: string }
    _count: { reviews: number }
  }
}

export function FeaturedDeal({ tool }: FeaturedDealProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!tool.dealEndsAt) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const dealEnd = new Date(tool.dealEndsAt!).getTime()
      const distance = dealEnd - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft('Deal expired')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [tool.dealEndsAt])

  const currentPrice = tool.dealPrice || tool.regularPrice
  const hasDiscount = !!tool.dealPrice && tool.dealPrice < tool.regularPrice

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wide mb-4 animate-pulse">
            🔥 Featured Deal of the Day
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {tool.name}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {tool.shortDescription || 'Revolutionary AI tool with lifetime access'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center justify-center mb-6">
                {tool.images[0] ? (
                  <img 
                    src={tool.images[0]} 
                    alt={tool.name} 
                    className="w-32 h-32 object-contain rounded-xl border border-gray-100"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-6xl">🛠️</span>
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  {hasDiscount && (
                    <span className="text-3xl text-gray-400 line-through">
                      ${Number(tool.regularPrice).toFixed(0)}
                    </span>
                  )}
                  <span className="text-6xl font-bold text-gray-900">
                    ${Number(currentPrice).toFixed(0)}
                  </span>
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-lg font-bold px-3 py-1 rounded-lg">
                      {tool.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-gray-600">Lifetime Access • No Monthly Fees</p>
              </div>

              {tool.dealEndsAt && (
                <div className="text-center mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">Deal expires in:</div>
                  <div className="text-3xl font-mono font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                    {timeLeft}
                  </div>
                </div>
              )}

              <Link href={`/tools/${tool.slug}`}>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg">
                  Get Lifetime Deal Now
                </button>
              </Link>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included:</h3>
              <ul className="space-y-3">
                {tool.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {tool.features.length === 0 && (
                  <>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Lifetime access to all features</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Commercial license included</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">60-day money-back guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Priority customer support</span>
                    </li>
                  </>
                )}
              </ul>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-800">
                    Limited time offer - This deal won't last long!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 