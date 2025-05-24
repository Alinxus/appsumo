'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ToolDetailHeroProps {
  tool: {
    id: string
    name: string
    shortDescription: string | null
    description: string | null
    regularPrice: any
    dealPrice: any | null
    discountPercentage: number | null
    dealStartsAt: Date | null
    dealEndsAt: Date | null
    images: string[]
    features: string[]
    isFeatured: boolean
    category: { name: string }
    vendor: {
      fullName: string | null
      email: string
    }
  }
  averageRating: number
  totalReviews: number
  totalPurchases: number
}

export function ToolDetailHero({ tool, averageRating, totalReviews, totalPurchases }: ToolDetailHeroProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 mb-6">
              <div className="aspect-square relative mb-4">
                {tool.images[selectedImage] ? (
                  <img
                    src={tool.images[selectedImage]}
                    alt={tool.name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-6xl">🛠️</span>
                  </div>
                )}
              </div>
              
              {tool.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {tool.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-green-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${tool.name} screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center text-blue-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  {totalPurchases}+ entrepreneurs already got this deal
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {tool.category.name}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {tool.name}
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              {tool.shortDescription || tool.description}
            </p>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({totalReviews} reviews)
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {hasDiscount && (
                    <span className="text-2xl text-gray-400 line-through">
                      ${Number(tool.regularPrice).toFixed(0)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    ${Number(currentPrice).toFixed(0)}
                  </span>
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {tool.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                
                {hasDiscount && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">You save</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${savings.toFixed(0)}
                    </div>
                  </div>
                )}
              </div>

              {tool.dealEndsAt && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">⏰ Limited time offer ends in:</div>
                  <div className="text-2xl font-mono font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg text-center">
                    {timeLeft}
                  </div>
                </div>
              )}

              <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg mb-4">
                Get Lifetime Deal - ${Number(currentPrice).toFixed(0)}
              </button>

              <div className="text-center text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-4">
                  <span>✓ Lifetime access</span>
                  <span>✓ Commercial license</span>
                  <span>✓ 60-day guarantee</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">What's included:</h3>
              <ul className="space-y-2">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {tool.features.length === 0 && (
                  <>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Lifetime access to all features</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Commercial license included</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">60-day money-back guarantee</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 