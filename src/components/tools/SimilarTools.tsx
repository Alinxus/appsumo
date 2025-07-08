import Link from 'next/link'
import { DealCard } from '@/components/site/DealCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface SimilarToolsProps {
  tools: Array<{
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
  }>
}

export function SimilarTools({ tools }: SimilarToolsProps) {
  if (tools.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            You might also like
          </h2>
          <p className="text-xl text-gray-600">
            More AI tools to supercharge your productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <DealCard key={tool.id} tool={tool} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="font-semibold">
            <Link
              href="/browse"
              className="inline-flex items-center"
            >
              Browse All Deals
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 