'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface DealCardProps {
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
    isFeatured: boolean
    category: { name: string }
    _count: { reviews: number }
  }
}

export function DealCard({ tool }: DealCardProps) {
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

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        } else {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        }
      } else {
        setTimeLeft('Deal expired')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [tool.dealEndsAt])

  const currentPrice = tool.dealPrice || tool.regularPrice
  const hasDiscount = !!tool.dealPrice && tool.dealPrice < tool.regularPrice

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-shrink-0">
            {tool.images[0] ? (
              <img 
                src={tool.images[0]} 
                alt={tool.name} 
                className="w-16 h-16 object-contain rounded-lg border border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {tool.isFeatured && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                🔥 Featured
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide animate-pulse">
                Limited Deal
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {tool.shortDescription || 'Powerful AI tool to boost your productivity'}
        </p>

        <div className="flex items-center gap-3 mb-4">
          {hasDiscount && (
            <span className="text-gray-400 line-through text-lg">
              ${Number(tool.regularPrice).toFixed(0)}
            </span>
          )}
          <span className="text-3xl font-bold text-gray-900">
            ${Number(currentPrice).toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
              {tool.discountPercentage}% OFF
            </span>
          )}
        </div>

        <ul className="text-sm text-gray-600 space-y-1 mb-6">
          {tool.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
          {tool.features.length === 0 && (
            <>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Lifetime access to all features
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Commercial license included
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                60-day money-back guarantee
              </li>
            </>
          )}
        </ul>

        <div className="space-y-3">
          <Link href={`/tools/${tool.slug}`}>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
              Get Lifetime Deal
            </button>
          </Link>
          
          {tool.dealEndsAt && (
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Deal ends in:</div>
              <div className={`text-lg font-mono font-bold ${timeLeft.includes('expired') ? 'text-red-600' : 'text-red-600'}`}>
                {timeLeft}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {tool.category.name}
            </span>
            <span>{tool._count.reviews} reviews</span>
          </div>
        </div>
      </div>
    </div>
  )
} 