import { db } from '@/db'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Marketplace Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">{marketplaceStats.totalTools}+</div><div className="text-gray-600">AI Tools</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">{marketplaceStats.totalUsers.toLocaleString()}+</div><div className="text-gray-600">Happy Customers</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">{marketplaceStats.totalSales.toLocaleString()}+</div><div className="text-gray-600">Tools Sold</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><div className="text-4xl font-bold text-neutral-900">${marketplaceStats.totalSavings.toLocaleString()}+</div><div className="text-gray-600">Total Savings</div></CardContent></Card>
        </div>
      </div>
      <Footer />
    </div>
  )
} 