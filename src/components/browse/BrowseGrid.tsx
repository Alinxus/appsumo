'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { DealCard } from '@/components/site/DealCard'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface Tool {
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

interface BrowseGridProps {
  tools: Tool[]
  hasMore: boolean
  totalCount: number
  searchQuery?: string
  categoryFilter?: string
  sortBy: string
}

export function BrowseGrid({ 
  tools: initialTools, 
  hasMore: initialHasMore,
  totalCount,
  searchQuery,
  categoryFilter,
  sortBy 
}: BrowseGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const params: Record<string, string> = {}
  if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter
  if (searchQuery) params.search = searchQuery
  if (sortBy) params.sort = sortBy

  const { data: tools, hasMore, loading, reset } = useInfiniteScroll({
    initialData: initialTools,
    hasMore: initialHasMore,
    endpoint: '/api/tools',
    params
  })

  useEffect(() => {
    reset(initialTools, initialHasMore)
  }, [initialTools, initialHasMore, reset])

  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No tools found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {searchQuery || categoryFilter 
            ? "Try adjusting your search terms or filters to find what you're looking for."
            : "No AI tools are available at the moment. Check back soon for new deals!"
          }
        </p>
        {(searchQuery || categoryFilter) && (
          <button
            onClick={() => router.push('/browse')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Tools
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          Showing {tools.length} of {totalCount} results
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <button className="p-2 text-gray-400 hover:text-gray-600 border rounded">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="p-2 text-gray-600 border rounded bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool) => (
          <DealCard key={tool.id} tool={tool} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading more deals...</span>
        </div>
      )}

      {!hasMore && tools.length > 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">🎉 You've seen all the deals!</div>
          <p className="text-sm text-gray-400">
            Check back soon for new AI tools and exclusive offers.
          </p>
        </div>
      )}

      <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center border border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🚀 Don't see what you're looking for?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          New AI tools are added regularly. Subscribe to our newsletter to be the first to know about exclusive deals and new tool launches.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
            Get Notified
          </button>
        </div>
      </div>
    </div>
  )
} 