import Link from 'next/link'

interface WishlistItem {
  id: string
  createdAt: Date
  tool: {
    id: string
    name: string
    slug: string
    shortDescription: string | null
    regularPrice: any
    dealPrice: any | null
    images: string[]
    category: { name: string }
  }
}

interface UserWishlistProps {
  wishlist: WishlistItem[]
}

export function UserWishlist({ wishlist }: UserWishlistProps) {
  if (wishlist.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Save tools you're interested in to compare and purchase later.
          </p>
          <Link
            href="/browse"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Discover Tools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Your Wishlist</h3>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {wishlist.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {item.tool.images[0] ? (
                  <img
                    src={item.tool.images[0]}
                    alt={item.tool.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🛠️</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.tool.name}
                </h4>
                <p className="text-xs text-gray-500 mb-1">
                  {item.tool.category.name}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.tool.dealPrice && item.tool.dealPrice < item.tool.regularPrice ? (
                      <>
                        <span className="text-sm font-semibold text-green-600">
                          ${Number(item.tool.dealPrice).toFixed(0)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ${Number(item.tool.regularPrice).toFixed(0)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        ${Number(item.tool.regularPrice).toFixed(0)}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/tools/${item.tool.slug}`}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {wishlist.length > 5 && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <Link
            href="/dashboard/wishlist"
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View All Wishlist Items
          </Link>
        </div>
      )}
    </div>
  )
} 