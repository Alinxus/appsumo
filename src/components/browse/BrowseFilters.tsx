'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  iconUrl: string | null
}

interface BrowseFiltersProps {
  categories: Category[]
  currentCategory?: string
  currentSort: string
}

export function BrowseFilters({ categories, currentCategory, currentSort }: BrowseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categorySlug === 'all') {
      params.delete('category')
    } else {
      params.set('category', categorySlug)
    }
    
    params.delete('page')
    router.push(`/browse?${params.toString()}`)
  }

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortValue)
    params.delete('page')
    router.push(`/browse?${params.toString()}`)
  }

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currentSort === option.value
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !currentCategory || currentCategory === 'all'
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">📁</span>
              <span>All Categories</span>
            </div>
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currentCategory === category.slug
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">
                  {category.iconUrl || '🔧'}
                </span>
                <div className="text-left">
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {category.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-2">
          💡 Why Choose Lifetime Deals?
        </h3>
        <ul className="text-sm text-green-800 space-y-2">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Pay once, use forever
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Save thousands on software costs
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            Commercial license included
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            60-day money-back guarantee
          </li>
        </ul>
      </div>

      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
        <h3 className="text-lg font-bold text-orange-900 mb-2">
          🔥 Limited Time Offers
        </h3>
        <p className="text-sm text-orange-800 mb-4">
          Many of these deals are only available for a short time. Don't miss out on huge savings!
        </p>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">⏰ Act Fast!</div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          📧 Newsletter Signup
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          Get notified about new deals and exclusive offers.
        </p>
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
} 