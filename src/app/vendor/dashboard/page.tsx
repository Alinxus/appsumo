import { requireVendor } from '@/lib/auth'
import { db } from '@/db'
import { VendorNavigation } from '@/components/vendor/VendorNavigation'
import { VendorStats } from '@/components/vendor/VendorStats'
import { VendorToolsList } from '@/components/vendor/VendorToolsList'
import { VendorQuickActions } from '@/components/vendor/VendorQuickActions'

export default async function VendorDashboard() {
  const user = await requireVendor()
  
  const [tools, totalSales, totalRevenue, recentPurchases] = await Promise.all([
    db.aiTool.findMany({
      where: { vendorId: user.profile!.id },
      include: {
        category: true,
        _count: { 
          select: { 
            reviews: true, 
            purchases: { where: { status: 'COMPLETED' } }
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.purchase.count({
      where: { 
        tool: { vendorId: user.profile!.id },
        status: 'COMPLETED'
      }
    }),
    db.purchase.aggregate({
      where: { 
        tool: { vendorId: user.profile!.id },
        status: 'COMPLETED'
      },
      _sum: { pricePaid: true }
    }),
    db.purchase.findMany({
      where: { 
        tool: { vendorId: user.profile!.id },
        status: 'COMPLETED'
      },
      include: {
        tool: { select: { name: true } },
        user: { select: { fullName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  const stats = {
    totalTools: tools.length,
    activeTools: tools.filter(tool => tool.status === 'ACTIVE').length,
    totalSales,
    totalRevenue: Number(totalRevenue._sum.pricePaid || 0),
    averageRating: tools.length > 0 
      ? tools.reduce((sum, tool) => sum + (tool._count.reviews || 0), 0) / tools.length 
      : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.profile?.fullName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your AI tools and track your performance
          </p>
        </div>

        <VendorStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <VendorToolsList tools={tools} />
          </div>
          
          <div>
            <VendorQuickActions />
            
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
              {recentPurchases.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💰</div>
                  <p className="text-gray-500">No sales yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your sales will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{purchase.tool.name}</p>
                        <p className="text-sm text-gray-600">
                          {purchase.user.fullName || purchase.user.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ${Number(purchase.pricePaid).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 