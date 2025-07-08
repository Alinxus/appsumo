import { requireVendor } from '@/lib/auth'
import { VendorNavigation } from '@/components/vendor/VendorNavigation'
import { AdvancedAnalytics } from '@/components/vendor/AdvancedAnalytics'

export const dynamic = 'force-dynamic'

export default async function VendorAnalyticsPage() {
  const user = await requireVendor()

  // TODO: Replace with real analytics data fetching logic
  const mockData = {
    revenue: { total: 12000, thisMonth: 3000, lastMonth: 2500, growth: 20 },
    sales: { total: 400, thisMonth: 100, lastMonth: 80, growth: 25 },
    views: { total: 10000, thisMonth: 2500, lastMonth: 2000, growth: 25 },
    conversionRate: { current: 4.0, previous: 3.5, growth: 14.3 },
    topPerformingTools: [
      { name: 'Tool A', revenue: 5000, sales: 150, views: 3000, conversionRate: 5.0 },
      { name: 'Tool B', revenue: 4000, sales: 120, views: 2500, conversionRate: 4.8 },
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 1000, sales: 30 },
      { month: 'Feb', revenue: 1200, sales: 40 },
      { month: 'Mar', revenue: 1500, sales: 50 },
      { month: 'Apr', revenue: 1800, sales: 60 },
    ],
    salesByTool: [
      { toolName: 'Tool A', sales: 150, revenue: 5000 },
      { toolName: 'Tool B', sales: 120, revenue: 4000 },
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavigation user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Advanced Analytics</h1>
        <AdvancedAnalytics data={mockData} timeRange="30d" />
      </div>
    </div>
  )
} 