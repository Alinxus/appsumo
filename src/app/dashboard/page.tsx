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
          <h1 className="text-3xl font-bold text-black">
            Welcome back, {user.profile?.fullName || user.email}!
          </h1>
          <p className="text-gray-700 mt-2">
            Manage your AI tools and discover new deals
          </p>
        </div>

        <UserDashboardStats stats={userStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <UserPurchases purchases={purchases} />
            <div className="mt-8 bg-black p-6 rounded-2xl border border-gray-200 text-center">
              <h3 className="text-xl font-bold text-white">Get the Best Deals on AI Tools!</h3>
              <p className="text-sm text-gray-300 mt-2">Don't miss out on exclusive offers. Discover tools to enhance your productivity.</p>
              <Button asChild size="sm" className="mt-4 bg-white text-black hover:bg-gray-100">
                <a href="/offers">Explore Offers</a>
              </Button>
            </div>
          </div>
          
          <div>
            <UserWishlist wishlist={wishlist} />
            
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-black mb-2">Discover More Tools</h3>
                    <p className="text-sm text-gray-600 mb-4">Explore our marketplace to find more AI tools that can boost your productivity.</p>
                    <Button asChild size="sm" className="w-full font-medium bg-black text-white hover:bg-gray-800">
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
