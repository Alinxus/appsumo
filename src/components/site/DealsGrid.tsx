import { DealCard } from './DealCard'

interface DealsGridProps {
  tools: {
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
  }[];
  title?: string;
  subtitle?: string;
}

export function DealsGrid({ tools, title = "Trending AI Tools", subtitle = "Exclusive lifetime deals on premium AI tools" }: DealsGridProps) {
  if (tools.length === 0) {
    return (
      <section className="py-16 bg-white">
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
            className="bg-[#00b289] hover:bg-[#00a07a] text-white px-6 py-3 rounded font-medium transition-colors"
          >
            Get notified when deals go live
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <DealCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a
            href="/browse"
            className="inline-flex items-center px-5 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Deals
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
} 