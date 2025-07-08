import { requireAuth } from '@/lib/auth'
import { db } from '@/db'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { UserDashboardStats } from '@/components/dashboard/UserDashboardStats'
import { UserPurchases } from '@/components/dashboard/UserPurchases'
import { UserWishlist } from '@/components/dashboard/UserWishlist'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { PurchaseHistory } from '@/components/dashboard/PurchaseHistory'
import { WishlistSection } from '@/components/dashboard/WishlistSection'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

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
            
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Discover More Tools</h3>
                    <p className="text-sm text-gray-600 mb-4">Explore our marketplace to find more AI tools that can boost your productivity.</p>
                    <Button asChild size="sm" className="w-full font-medium">
                      <a href="/browse">Browse Deals</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
