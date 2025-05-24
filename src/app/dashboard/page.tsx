import { requireAuth } from '@/lib/auth'
import { db } from '@/db'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { UserDashboardStats } from '@/components/dashboard/UserDashboardStats'
import { UserPurchases } from '@/components/dashboard/UserPurchases'
import { UserWishlist } from '@/components/dashboard/UserWishlist'

export default async function UserDashboard() {
  const user = await requireAuth()
  
  const [purchases, wishlist, stats] = await Promise.all([
    db.purchase.findMany({
      where: { userId: user.profile!.id },
      include: {
        tool: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    db.wishlist.findMany({
      where: { userId: user.profile!.id },
      include: {
        tool: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.purchase.aggregate({
      where: { 
        userId: user.profile!.id,
        status: 'COMPLETED'
      },
      _count: true,
      _sum: { pricePaid: true }
    })
  ])

  const userStats = {
    totalPurchases: stats._count,
    totalSpent: Number(stats._sum.pricePaid || 0),
    totalWishlisted: wishlist.length,
    totalSaved: purchases.reduce((sum, purchase) => {
      const regular = Number(purchase.tool.regularPrice)
      const paid = Number(purchase.pricePaid)
      return sum + (regular - paid)
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.profile?.fullName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your AI tools and discover new deals
          </p>
        </div>

        <UserDashboardStats stats={userStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <UserPurchases purchases={purchases} />
          </div>
          
          <div>
            <UserWishlist wishlist={wishlist} />
            
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-2">
                🎯 Discover More Tools
              </h3>
              <p className="text-sm text-green-800 mb-4">
                Explore our marketplace to find more AI tools that can boost your productivity.
              </p>
              <a
                href="/browse"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Browse Deals
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
