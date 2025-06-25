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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
  const savings = hasDiscount ? Number(tool.regularPrice) - Number(tool.dealPrice) : 0

  return (
    <section className="relative py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white mb-6 animate-pulse">
            🔥 FEATURED DEAL OF THE DAY
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {tool.name}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {tool.shortDescription || 'Revolutionary AI tool with lifetime access'}
          </p>
        </div>

        {/* Main deal card */}
        <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Image and badges */}
            <div className="space-y-6">
              <div className="relative">
                {tool.images[0] ? (
                  <img
                    src={tool.images[0]}
                    alt={tool.name}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                    <span className="text-8xl">🛠️</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                    🏆 BEST SELLER
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white">
                    ⭐ STAFF PICK
                  </span>
                </div>
                
                {hasDiscount && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-500 text-white animate-pulse">
                      {tool.discountPercentage}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Category and rating */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {tool.category.name}
                </span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({tool._count?.reviews || 0})</span>
                </div>
              </div>
            </div>

            {/* Right side - Pricing and CTA */}
            <div className="space-y-8">
              {/* Pricing */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {hasDiscount && (
                      <span className="text-3xl text-gray-400 line-through">
                        ${Number(tool.regularPrice).toFixed(0)}
                      </span>
                    )}
                    <span className="text-5xl font-bold text-gray-900">
                      ${Number(currentPrice).toFixed(0)}
                    </span>
                  </div>
                  
                  {hasDiscount && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600">You save</div>
                      <div className="text-3xl font-bold text-green-600">
                        ${savings.toFixed(0)}
                      </div>
                    </div>
                  )}
                </div>

                {tool.dealEndsAt && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-3">⏰ Limited time offer ends in:</div>
                    <div className="text-2xl font-mono font-bold text-red-600 bg-red-50 px-6 py-3 rounded-xl text-center border-2 border-red-200">
                      {timeLeft}
                    </div>
                  </div>
                )}

                <Link href={`/tools/${tool.slug}`}>
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-2xl font-bold py-6 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Get Lifetime Deal - ${Number(currentPrice).toFixed(0)}
                  </button>
                </Link>

                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Lifetime access
                  </span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Commercial license
                  </span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    60-day guarantee
                  </span>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-xl">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                  
                  {tool.features.length < 6 && (
                    <>
                      <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                        <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">Lifetime access to all features</span>
                      </div>
                      <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                        <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">Commercial license included</span>
                      </div>
                      <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                        <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 font-medium">60-day money-back guarantee</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 