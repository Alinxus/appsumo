import { DealCard } from './DealCard'

interface DealsGridProps {
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

export function DealsGrid({ tools }: DealsGridProps) {
  if (tools.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🛠️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No deals available yet
          </h2>
          <p className="text-gray-600 mb-8">
            Check back soon for amazing AI tool deals!
          </p>
          <a
            href="/auth/register"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Get notified when deals go live
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🔥 Limited-Time AI Tool Deals
          </h2>
          <p className="text-xl text-gray-600">
            Grab these exclusive deals before they expire!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <DealCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="/browse"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            View All Deals
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
} 