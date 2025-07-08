import { db } from '@/db'
import { HeroSection } from '@/components/site/HeroSection'
import { FeaturedDeal } from '@/components/site/FeaturedDeal'
import { DealsGrid } from '@/components/site/DealsGrid'
import { CategoriesSection } from '@/components/site/CategoriesSection'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
        title={settings?.heroTitle || 'Discover AI Tools. Stay Innovative.'}
        subtitle={settings?.heroSubtitle || 'Top AI software deals for entrepreneurs at incredible prices. Lifetime access to premium tools with no monthly fees.'}
        stats={marketplaceStats}
      />
      
      {featuredTool && (
        <FeaturedDeal tool={featuredTool} />
      )}
      
      <CategoriesSection categories={categories} />
      
      <DealsGrid tools={activeTools} />
      
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join thousands of entrepreneurs</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Don't miss out on exclusive AI tool deals. Get lifetime access to premium software at unbeatable prices.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">{marketplaceStats.totalTools}+</div><div className="text-gray-600">AI Tools</div></CardContent></Card>
            <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">{marketplaceStats.totalUsers.toLocaleString()}+</div><div className="text-gray-600">Happy Customers</div></CardContent></Card>
            <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">{marketplaceStats.totalSales.toLocaleString()}+</div><div className="text-gray-600">Tools Sold</div></CardContent></Card>
            <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">${marketplaceStats.totalSavings.toLocaleString()}+</div><div className="text-gray-600">Total Savings</div></CardContent></Card>
          </div>
          <Button asChild size="lg" className="text-lg font-semibold">
            <a href="/browse" className="inline-flex items-center">Browse All Deals<svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></a>
          </Button>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-none bg-transparent"><CardContent className="p-0 text-left"><div className="text-2xl mb-2">⭐</div><div className="font-semibold text-gray-900 mb-1">Trusted by 10,000+ users</div><div className="text-gray-600 text-sm">Our marketplace is trusted by entrepreneurs and businesses worldwide.</div></CardContent></Card>
            <Card className="border-0 shadow-none bg-transparent"><CardContent className="p-0 text-left"><div className="text-2xl mb-2">🔒</div><div className="font-semibold text-gray-900 mb-1">Secure Payments</div><div className="text-gray-600 text-sm">All transactions are encrypted and protected for your peace of mind.</div></CardContent></Card>
            <Card className="border-0 shadow-none bg-transparent"><CardContent className="p-0 text-left"><div className="text-2xl mb-2">💬</div><div className="font-semibold text-gray-900 mb-1">24/7 Support</div><div className="text-gray-600 text-sm">Our team is always here to help you with any questions or issues.</div></CardContent></Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
} 