import { db } from '@/db'

export async function RecentActivity() {
  const recentPurchases = await db.purchase.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { fullName: true, email: true } },
      tool: { select: { name: true } }
    }
  })

  const recentReviews = await db.review.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { fullName: true, email: true } },
      tool: { select: { name: true } }
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Latest Purchases</h4>
          <div className="space-y-2">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {purchase.user.fullName || purchase.user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    bought {purchase.tool.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${purchase.pricePaid.toString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Latest Reviews</h4>
          <div className="space-y-2">
            {recentReviews.map((review) => (
              <div key={review.id} className="py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {review.user.fullName || review.user.email}
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {review.tool.name}
                </p>
                {review.title && (
                  <p className="text-sm text-gray-700 mt-1 truncate">
                    "{review.title}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
 