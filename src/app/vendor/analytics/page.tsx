import { requireVendor } from '@/lib/auth'
import { VendorNavigation } from '@/components/vendor/VendorNavigation'
import { AdvancedAnalytics } from '@/components/vendor/AdvancedAnalytics'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function VendorAnalyticsPage() {
  const user = await requireVendor()

  // Fetch analytics data for this vendor
  // Revenue, sales, views, conversion rate, top tools, revenue by month, sales by tool
  const [tools, purchases] = await Promise.all([
    db.aiTool.findMany({
      where: { vendorId: user.profile.id },
      include: { _count: { select: { purchases: true, reviews: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    db.purchase.findMany({
      where: { tool: { vendorId: user.profile.id }, status: 'COMPLETED' },
      include: { tool: true },
      orderBy: { createdAt: 'desc' }
    })
  ])

  // Calculate analytics
  const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.pricePaid), 0)
  const thisMonth = new Date().getMonth()
  const lastMonth = (thisMonth + 11) % 12
  const salesThisMonth = purchases.filter(p => new Date(p.createdAt).getMonth() === thisMonth)
  const salesLastMonth = purchases.filter(p => new Date(p.createdAt).getMonth() === lastMonth)
  const revenueThisMonth = salesThisMonth.reduce((sum, p) => sum + Number(p.pricePaid), 0)
  const revenueLastMonth = salesLastMonth.reduce((sum, p) => sum + Number(p.pricePaid), 0)
  const growth = revenueLastMonth > 0 ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 : 0
  const totalSales = purchases.length
  const views = tools.reduce((sum, t) => sum + (t.viewCount || 0), 0)
  const viewsThisMonth = tools.reduce((sum, t) => sum + (t.viewCount || 0), 0) // Placeholder, needs real view tracking
  const viewsLastMonth = 0 // Placeholder
  const conversionRate = views > 0 ? (totalSales / views) * 100 : 0
  const prevConversionRate = 0 // Placeholder
  const conversionGrowth = 0 // Placeholder
  const topPerformingTools = tools
    .map(t => ({
      name: t.name,
      revenue: purchases.filter(p => p.toolId === t.id).reduce((sum, p) => sum + Number(p.pricePaid), 0),
      sales: purchases.filter(p => p.toolId === t.id).length,
      views: t.viewCount || 0,
      conversionRate: t.viewCount ? (purchases.filter(p => p.toolId === t.id).length / t.viewCount) * 100 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const revenueByMonth = months.map((month, idx) => {
    const monthSales = purchases.filter(p => new Date(p.createdAt).getMonth() === idx)
    return {
      month,
      revenue: monthSales.reduce((sum, p) => sum + Number(p.pricePaid), 0),
      sales: monthSales.length
    }
  })
  const salesByTool = tools.map(t => ({
    toolName: t.name,
    sales: purchases.filter(p => p.toolId === t.id).length,
    revenue: purchases.filter(p => p.toolId === t.id).reduce((sum, p) => sum + Number(p.pricePaid), 0)
  }))

  const analyticsData = {
    revenue: { total: totalRevenue, thisMonth: revenueThisMonth, lastMonth: revenueLastMonth, growth },
    sales: { total: totalSales, thisMonth: salesThisMonth.length, lastMonth: salesLastMonth.length, growth: salesLastMonth.length > 0 ? ((salesThisMonth.length - salesLastMonth.length) / salesLastMonth.length) * 100 : 0 },
    views: { total: views, thisMonth: viewsThisMonth, lastMonth: viewsLastMonth, growth: 0 },
    conversionRate: { current: conversionRate, previous: prevConversionRate, growth: conversionGrowth },
    topPerformingTools,
    revenueByMonth,
    salesByTool
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavigation user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Advanced Analytics</h1>
        <AdvancedAnalytics data={analyticsData} timeRange="30d" />
      </div>
    </div>
  )
} 