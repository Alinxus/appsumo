'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface DealCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    regularPrice: any;
    dealPrice: any | null;
    discountPercentage: number | null;
    dealEndsAt: Date | null;
    images: string[];
    category: { name: string };
    vendor: { fullName: string | null; email: string };
    _count: { reviews: number };
  };
}

export function DealCard({ tool }: DealCardProps) {
  const [timeLeft, setTimeLeft] = useState('')
  // For demo purposes - mock rating between 4-5
  const avgRating = 4 + Math.random()

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
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`)
        } else {
          setTimeLeft(`${hours}h ${minutes}m`)
        }
      } else {
        setTimeLeft('Expired')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [tool.dealEndsAt])

  const currentPrice = tool.dealPrice || tool.regularPrice
  const hasDiscount = !!tool.dealPrice && tool.dealPrice < tool.regularPrice
  
  return (
    <div className="bg-white border border-gray-200 hover:shadow-sm transition-all">
      <div className="relative">
        <Link href={`/tools/${tool.slug}`}>
          {tool.images[0] ? (
            <img 
              src={tool.images[0]} 
              alt={tool.name} 
              className="w-full aspect-video object-cover" 
            />
          ) : (
            <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
              <span className="text-4xl">🛠️</span>
            </div>
          )}
        </Link>
        
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {tool.discountPercentage}% OFF
          </div>
        )}
        
        <div className="absolute top-2 left-2">
          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded capitalize">
            {tool.category?.name || 'AI Tool'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-1">{tool.name}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {tool.shortDescription || 'Powerful AI tool with premium features and lifetime access.'}
        </p>
        
        <div className="flex items-center mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star} 
              className={`w-3 h-3 ${star <= Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({tool._count?.reviews || 0})</span>
        </div>
        
        <div className="flex items-baseline mb-3">
          <span className="text-lg font-bold">${Number(currentPrice).toFixed(0)}</span>
          {hasDiscount && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              ${Number(tool.regularPrice).toFixed(0)}
            </span>
          )}
        </div>
        
        <Link 
          href={`/tools/${tool.slug}`}
          className="block w-full bg-[#00b289] hover:bg-[#00a07a] text-white text-center py-2 text-sm font-medium rounded transition-colors"
        >
          View Deal
        </Link>
      </div>
    </div>
  )
} 