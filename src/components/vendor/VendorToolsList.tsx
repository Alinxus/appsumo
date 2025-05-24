import Link from 'next/link'

interface Tool {
  id: string
  name: string
  slug: string
  status: string
  regularPrice: any
  dealPrice: any | null
  isFeatured: boolean
  createdAt: Date
  category: { name: string }
  _count: { reviews: number; purchases: number }
}

interface VendorToolsListProps {
  tools: Tool[]
}

export function VendorToolsList({ tools }: VendorToolsListProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800',
      REJECTED: 'bg-red-100 text-red-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      DRAFT: 'Draft',
      PENDING_REVIEW: 'Pending Review',
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
      REJECTED: 'Rejected'
    }
    return texts[status as keyof typeof texts] || status
  }

  if (tools.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🛠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tools yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first AI tool to the marketplace
          </p>
          <Link
            href="/vendor/tools/new"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Your First Tool
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your AI Tools</h3>
        <Link
          href="/vendor/tools/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add New Tool
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tool
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviews
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900">
                          {tool.name}
                        </div>
                        {tool.isFeatured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{tool.category.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tool.status)}`}>
                    {getStatusText(tool.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    {tool.dealPrice && tool.dealPrice < tool.regularPrice ? (
                      <>
                        <span className="font-semibold text-green-600">
                          ${Number(tool.dealPrice).toFixed(0)}
                        </span>
                        <span className="text-gray-400 line-through">
                          ${Number(tool.regularPrice).toFixed(0)}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold">
                        ${Number(tool.regularPrice).toFixed(0)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tool._count.purchases}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tool._count.reviews}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <Link
                      href={`/vendor/tools/${tool.id}/edit`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </Link>
                    {tool.status === 'ACTIVE' && (
                      <button className="text-orange-600 hover:text-orange-900">
                        Pause
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 