import { db } from '@/db'
import { HeroSection } from '@/components/site/HeroSection'
import { FeaturedDeal } from '@/components/site/FeaturedDeal'
import { DealsGrid } from '@/components/site/DealsGrid'
import { CategoriesSection } from '@/components/site/CategoriesSection'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await db.adminSettings.findFirst()
  
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })
  
  const featuredTool = await db.aiTool.findFirst({
    where: {
      status: 'ACTIVE',
      isFeatured: true,
      dealEndsAt: { gt: new Date() }
    },
    include: {
      category: true,
      vendor: { select: { fullName: true, email: true } },
      _count: { select: { reviews: true } }
    }
  })
  
  const activeTools = await db.aiTool.findMany({
    where: {
      status: 'ACTIVE'
    },
    include: {
      category: true,
      vendor: { select: { fullName: true, email: true } },
      _count: { select: { reviews: true } }
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 12
  })
  
  const stats = await Promise.all([
    db.aiTool.count({ where: { status: 'ACTIVE' } }),
    db.profile.count({ where: { role: 'USER' } }),
    db.purchase.count({ where: { status: 'COMPLETED' } }),
    db.purchase.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { pricePaid: true }
    })
  ])
  
  const marketplaceStats = {
    totalTools: stats[0],
    totalUsers: stats[1],
    totalSales: stats[2],
    totalSavings: stats[3]._sum.pricePaid ? Number(stats[3]._sum.pricePaid) * 2 : 0
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <HeroSection 
        title={settings?.heroTitle || 'Discover Premium AI Tools. Stay Innovative.'}
        subtitle={settings?.heroSubtitle || 'Top AI software deals for entrepreneurs at incredible prices. Lifetime access to premium tools with no monthly fees.'}
        stats={marketplaceStats}
      />
      
      {featuredTool && (
        <FeaturedDeal tool={featuredTool} />
      )}
      
      <CategoriesSection categories={categories} />
      
      <DealsGrid tools={activeTools} />
      
      {/* CTA Section */}
      <div className="bg-black text-white section-padding">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 animate-fade-in">
            Join thousands of entrepreneurs
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up">
            Don't miss out on exclusive AI tool deals. Get lifetime access to premium software at unbeatable prices.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="animate-scale-in">
              <div className="text-5xl font-black text-white mb-2">{marketplaceStats.totalTools}+</div>
              <div className="text-gray-400 font-medium">AI Tools</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="text-5xl font-black text-white mb-2">{marketplaceStats.totalUsers.toLocaleString()}+</div>
              <div className="text-gray-400 font-medium">Happy Customers</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl font-black text-white mb-2">{marketplaceStats.totalSales.toLocaleString()}+</div>
              <div className="text-gray-400 font-medium">Tools Sold</div>
            </div>
            <div className="animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl font-black text-white mb-2">${marketplaceStats.totalSavings.toLocaleString()}+</div>
              <div className="text-gray-400 font-medium">Total Savings</div>
            </div>
          </div>
          <a
            href="/browse"
            className="bg-white text-black px-12 py-5 rounded-xl text-lg font-black transition-all duration-300 inline-flex items-center hover:bg-gray-200 hover:scale-105 shadow-2xl"
          >
            Browse All Deals
            <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 