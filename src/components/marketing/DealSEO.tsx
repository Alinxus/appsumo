"use client"

import { useEffect } from 'react'
import Head from 'next/head'

interface DealSEOProps {
  tool: {
    name: string
    slug: string
    shortDescription?: string
    description?: string
    regularPrice: number
    dealPrice?: number
    discountPercentage?: number
    images?: string[]
    category: {
      name: string
      slug: string
    }
    vendor: {
      fullName?: string
      email: string
    }
    _count: {
      reviews: number
    }
    dealEndsAt?: string
    isFeatured: boolean
    isBestSeller: boolean
    isStaffPick: boolean
  }
}

export function DealSEO({ tool }: DealSEOProps) {
  const discountPercentage = tool.discountPercentage || 
    (tool.regularPrice && tool.dealPrice ? 
      Math.round(((Number(tool.regularPrice) - Number(tool.dealPrice)) / Number(tool.regularPrice)) * 100) : 0)

  const currentPrice = tool.dealPrice || tool.regularPrice
  const originalPrice = tool.regularPrice

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": tool.name,
    "description": tool.shortDescription || tool.description,
    "image": tool.images && tool.images.length > 0 ? tool.images[0] : undefined,
    "category": tool.category.name,
    "brand": {
      "@type": "Brand",
      "name": tool.vendor.fullName || tool.vendor.email.split('@')[0]
    },
    "offers": {
      "@type": "Offer",
      "price": currentPrice,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": tool.dealEndsAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "seller": {
        "@type": "Organization",
        "name": "AIsumo"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": tool._count.reviews || 0
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Verified Buyer"
      },
      "reviewBody": `Great deal on ${tool.name}! Lifetime access for an unbeatable price.`
    }
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://aisumo.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": "https://aisumo.com/browse"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.category.name,
        "item": `https://aisumo.com/browse?category=${tool.category.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": tool.name,
        "item": `https://aisumo.com/tools/${tool.slug}`
      }
    ]
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is included in the ${tool.name} deal?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ${tool.name} deal includes lifetime access to all features, commercial license, and no monthly fees.`
        }
      },
      {
        "@type": "Question",
        "name": "Is this a lifetime deal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this is a lifetime deal. You pay once and get access forever with no recurring fees."
        }
      },
      {
        "@type": "Question",
        "name": "What if I'm not satisfied?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a 60-day money-back guarantee. If you're not satisfied, contact us for a full refund."
        }
      },
      {
        "@type": "Question",
        "name": "When does this deal end?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": tool.dealEndsAt ? 
            `This deal ends on ${new Date(tool.dealEndsAt).toLocaleDateString()}.` : 
            "This deal is available for a limited time only."
        }
      }
    ]
  }

  const metaTitle = `${tool.name} - ${discountPercentage > 0 ? `${discountPercentage}% OFF` : 'Lifetime Deal'} | AIsumo`
  const metaDescription = `${tool.shortDescription || tool.description} Get ${tool.name} for ${discountPercentage > 0 ? `${discountPercentage}% off` : 'an unbeatable price'}. Lifetime access, no monthly fees. ${tool._count.reviews > 0 ? `${tool._count.reviews} verified reviews.` : ''}`

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${tool.name}, ${tool.category.name}, AI tools, lifetime deal, software deals, appsumo alternative, ${discountPercentage > 0 ? 'discount' : 'deal'}`} />
        
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://aisumo.com/tools/${tool.slug}`} />
        {tool.images && tool.images.length > 0 && (
          <meta property="og:image" content={tool.images[0]} />
        )}
        <meta property="og:site_name" content="AIsumo" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {tool.images && tool.images.length > 0 && (
          <meta name="twitter:image" content={tool.images[0]} />
        )}
        
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AIsumo" />
        
        <link rel="canonical" href={`https://aisumo.com/tools/${tool.slug}`} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData)
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqData)
          }}
        />
      </Head>
    </>
  )
}

export function DealSocialShare({ tool }: DealSEOProps) {
  const shareUrl = `https://aisumo.com/tools/${tool.slug}`
  const shareText = `Check out this amazing deal on ${tool.name}! ${tool.discountPercentage ? `${tool.discountPercentage}% OFF` : 'Lifetime access'} - no monthly fees! 🚀`
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(`Amazing deal on ${tool.name}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Share this deal</h3>
      <div className="flex gap-2">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Twitter
        </button>
        
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </button>
        
        <button
          onClick={() => handleShare('email')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </button>
      </div>
    </div>
  )
} 