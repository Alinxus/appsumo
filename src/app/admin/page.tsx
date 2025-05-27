import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminStats } from '@/components/admin/AdminStats'
import { AdminQuickActions } from '@/components/admin/AdminQuickActions'
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { QuickActions } from '@/components/admin/QuickActions'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalTools,
    totalPurchases,
    pendingReviews,
    vendorApplications,
    totalRevenue
  ] = await Promise.all([
    db.profile.count(),
    db.aiTool.count(),
    db.purchase.count({ where: { status: 'COMPLETED' } }),
    db.review.count({ where: { isApproved: false } }),
    db.vendorApplication.count({ where: { status: 'PENDING' } }),
    db.purchase.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { pricePaid: true }
    })
  ])

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: '👥',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'AI Tools',
      value: totalTools.toLocaleString(),
      icon: '🛠️',
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      title: 'Completed Sales',
      value: totalPurchases.toLocaleString(),
      icon: '💰',
      change: '+18%',
      changeType: 'positive' as const
    },
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue._sum.pricePaid || 0).toLocaleString()}`,
      icon: '📈',
      change: '+24%',
      changeType: 'positive' as const
    },
  ]

  const alerts = [
    ...(pendingReviews > 0 ? [`${pendingReviews} reviews pending approval`] : []),
    ...(vendorApplications > 0 ? [`${vendorApplications} vendor applications waiting`] : []),
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your AI tools marketplace</p>
      </div>

      {alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  {alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminStatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  )
} 