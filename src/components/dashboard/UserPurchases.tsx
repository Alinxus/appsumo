import Link from 'next/link'

interface Purchase {
  id: string
  pricePaid: any
  status: string
  createdAt: Date
  tool: {
    id: string
    name: string
    slug: string
    images: string[]
    category: { name: string }
  }
}

interface UserPurchasesProps {
  purchases: Purchase[]
}

export function UserPurchases({ purchases }: UserPurchasesProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No purchases yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start exploring our marketplace to find amazing AI tools at lifetime deal prices.
          </p>
          <Link
            href="/browse"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse AI Tools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your AI Tools</h3>
        <Link
          href="/browse"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Browse More
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {purchase.tool.images[0] ? (
                  <img
                    src={purchase.tool.images[0]}
                    alt={purchase.tool.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🛠️</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 truncate">
                    {purchase.tool.name}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(purchase.status)}`}>
                    {purchase.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {purchase.tool.category.name}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Purchased {new Date(purchase.createdAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-green-600">
                      ${Number(purchase.pricePaid).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/tools/${purchase.tool.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    {purchase.status === 'COMPLETED' && (
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {purchases.length >= 10 && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <Link
            href="/dashboard/purchases"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            View All Purchases
          </Link>
        </div>
      )}
    </div>
  )
} 