import { db } from '@/db'
import { BrowseHeader } from '@/components/browse/BrowseHeader'
import { BrowseFilters } from '@/components/browse/BrowseFilters'
import { BrowseGrid } from '@/components/browse/BrowseGrid'
import { BrowsePagination } from '@/components/browse/BrowsePagination'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Browse AI Tools - Lifetime Deals | AIsumo',
  description: 'Discover the best AI tools at unbeatable prices. Lifetime access to premium software with no monthly fees.'
}

export const dynamic = 'force-dynamic'

interface SearchParams {
  category?: string
  search?: string
  sort?: string
  page?: string
}

export default async function BrowsePage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  const currentPage = parseInt(searchParams.page || '1')
  const itemsPerPage = 12
  const categoryFilter = searchParams.category
  const searchQuery = searchParams.search
  const sortBy = searchParams.sort || 'newest'

  let orderBy: any = { createdAt: 'desc' }
  
  switch (sortBy) {
    case 'price-low':
      orderBy = { dealPrice: 'asc' }
      break
    case 'price-high':
      orderBy = { dealPrice: 'desc' }
      break
    case 'popular':
      orderBy = { purchases: { _count: 'desc' } }
      break
    case 'rating':
      orderBy = { reviews: { _count: 'desc' } }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  const whereClause: any = {
    status: 'ACTIVE',
    ...(categoryFilter && categoryFilter !== 'all' && {
      category: { slug: categoryFilter }
    }),
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { shortDescription: { contains: searchQuery, mode: 'insensitive' } },
        { features: { hasSome: [searchQuery] } }
      ]
    })
  }

  const [tools, totalCount, categories] = await Promise.all([
    db.aiTool.findMany({
      where: whereClause,
      include: {
        category: true,
        _count: { select: { reviews: true, purchases: true } }
      },
      orderBy,
      take: itemsPerPage
    }),
    db.aiTool.count({ where: whereClause }),
    db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
  ])
  
  const hasMore = tools.length === itemsPerPage && totalCount > itemsPerPage

  const featuredTools = await db.aiTool.findMany({
    where: {
      status: 'ACTIVE',
      isFeatured: true,
      dealEndsAt: { gt: new Date() }
    },
    include: {
      category: true,
      _count: { select: { reviews: true } }
    },
    take: 3
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <BrowseHeader 
        totalCount={totalCount}
        currentSearch={searchQuery}
        currentCategory={categoryFilter}
      />

      {featuredTools.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Featured Deals - Don't Miss Out!</h2>
              <p className="text-xl text-gray-600">Limited-time offers ending soon</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTools.map((tool) => (
                <Card key={tool.id} className="border border-orange-200 bg-white rounded-2xl shadow-sm p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">FEATURED</span>
                      <span className="text-2xl font-bold text-gray-900">${Number(tool.dealPrice || tool.regularPrice).toFixed(0)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{tool.shortDescription}</p>
                    <Button asChild size="lg" className="w-full font-bold">
                      <a href={`/tools/${tool.slug}`}>Get Deal Now</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <BrowseFilters 
              categories={categories}
              currentCategory={categoryFilter}
              currentSort={sortBy}
            />
          </aside>
          
          <main className="flex-1">
            <BrowseGrid 
              tools={tools}
              hasMore={hasMore}
              totalCount={totalCount}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              sortBy={sortBy}
            />
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 