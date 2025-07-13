import { requireVendor } from '@/lib/auth'
import { db } from '@/db'
import { VendorNavigation } from '@/components/vendor/VendorNavigation'
import { LicenseKeyManager } from '@/components/vendor/LicenseKeyManager'
import Link from 'next/link'
import { VendorStats } from '@/components/vendor/VendorStats'
import { VendorTools } from '@/components/vendor/VendorTools'
import { VendorRecentSales } from '@/components/vendor/VendorRecentSales'

export const dynamic = 'force-dynamic'

export default async function VendorDashboard() {
  const user = await requireVendor()
  
  const [tools, stats, recentPurchases] = await Promise.all([
    db.aiTool.findMany({
      where: { vendorId: user.profile!.id },
      include: {
        category: true,
        _count: { select: { purchases: true, reviews: true, wishlists: true, licenseKeys: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.purchase.aggregate({
      where: { 
        tool: { vendorId: user.profile!.id },
        status: 'COMPLETED'
      },
      _count: true,
      _sum: { pricePaid: true }
    }),
    db.purchase.findMany({
      where: { 
        tool: { vendorId: user.profile!.id }
      },
      include: {
        tool: true,
        user: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])

  const totalRevenue = Number(stats._sum.pricePaid || 0)
  const vendorRevenue = totalRevenue * 0.3 // 30% vendor share
  const platformCommission = totalRevenue * 0.7 // 70% platform share

  const dashboardStats = {
    totalTools: tools.length,
    activeTools: tools.filter(t => t.status === 'ACTIVE').length,
    totalSales: stats._count,
    totalRevenue: vendorRevenue,
    platformCommission,
    avgRating: 4.8, // TODO: Calculate from reviews
    totalLicenseKeys: tools.reduce((sum, tool) => sum + (tool._count.licenseKeys || 0), 0)
  }

  return (
    <div className="min-h-screen bg-white">
      <VendorNavigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.profile?.fullName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your AI tools and track your AppSumo marketplace performance
          </p>
        </div>

        {/* AppSumo-Style Business Overview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">💰 Your AppSumo Business</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">${vendorRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Your Revenue (30%)</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalSales}</div>
              <div className="text-sm text-gray-600">Total Sales</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{dashboardStats.activeTools}</div>
              <div className="text-sm text-gray-600">Active Tools</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{dashboardStats.totalLicenseKeys}</div>
              <div className="text-sm text-gray-600">License Keys</div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Platform commission: ${platformCommission.toLocaleString()} (70%) • 
            Payment processing: ~${(totalRevenue * 0.03).toLocaleString()} (3%)
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/vendor/tools/new"
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit New Tool</h3>
              <p className="text-gray-600 text-sm">List your AI tool on the marketplace and start earning</p>
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Track your sales performance and customer insights</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm">Get help with your listings and marketplace questions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Tools */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Your AI Tools</h3>
                <Link
                  href="/vendor/tools/new"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add New Tool
                </Link>
              </div>

              <div className="divide-y divide-gray-200">
                {tools.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">🛠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools yet</h3>
                    <p className="text-gray-600 mb-6">
                      Submit your first AI tool to start earning on our marketplace
                    </p>
                    <Link
                      href="/vendor/tools/new"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Submit Your First Tool
                    </Link>
                  </div>
                ) : (
                  tools.map((tool) => (
                    <div key={tool.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{tool.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tool.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              tool.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                              tool.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tool.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{tool.shortDescription}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span>{tool.category.name}</span>
                            <span>{tool._count.purchases} sales</span>
                            <span>{tool._count.reviews} reviews</span>
                            <span>{tool._count.wishlists} wishlisted</span>
                            {tool.fulfillmentMethod === 'BULK_KEYS' && (
                              <span>{tool._count.licenseKeys} license keys</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="text-lg font-bold text-green-600">
                              ${Number(tool.dealPrice || tool.regularPrice).toFixed(0)}
                            </div>
                            {tool.dealPrice && tool.dealPrice < tool.regularPrice && (
                              <div className="text-sm text-gray-400 line-through">
                                ${Number(tool.regularPrice).toFixed(0)}
                              </div>
                            )}
                            <div className="text-sm text-blue-600 font-medium">
                              Your cut: ${((Number(tool.dealPrice || tool.regularPrice)) * 0.3).toFixed(0)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-6">
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </Link>
                          <Link
                            href={`/vendor/tools/${tool.id}/edit`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>

                      {/* License Key Management for Bulk Keys */}
                      {tool.fulfillmentMethod === 'BULK_KEYS' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <LicenseKeyManager 
                            toolId={tool.id}
                            toolName={tool.name}
                            fulfillmentMethod={tool.fulfillmentMethod}
                          />
                        </div>
                      )}

                      {/* Fulfillment Method Info */}
                      {tool.fulfillmentMethod !== 'BULK_KEYS' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium">Fulfillment:</span>
                            <span className="ml-2">
                              {tool.fulfillmentMethod === 'COUPON_CODE' && `Coupon: ${tool.couponCode}`}
                              {tool.fulfillmentMethod === 'API_PROVISION' && 'API Integration'}
                              {tool.fulfillmentMethod === 'MANUAL_FULFILLMENT' && 'Manual (24-48hrs)'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Sales & Analytics */}
          <div className="space-y-6">
            {/* Recent Sales */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {recentPurchases.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-gray-600 text-sm">No sales yet</p>
                  </div>
                ) : (
                  recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{purchase.tool.name}</h4>
                          <p className="text-xs text-gray-500">{purchase.user.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            ${(Number(purchase.pricePaid) * 0.3).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AppSumo Partnership Info */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-lg font-bold text-orange-900 mb-3">🤝 AppSumo Partnership</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-700">Commission Split:</span>
                  <span className="font-medium text-orange-900">70% / 30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Payment Schedule:</span>
                  <span className="font-medium text-orange-900">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Customer Support:</span>
                  <span className="font-medium text-orange-900">Shared</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Refund Policy:</span>
                  <span className="font-medium text-orange-900">60 days</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-orange-200">
                <p className="text-xs text-orange-700">
                  Questions about the partnership? Contact your account manager or visit our vendor support center.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 