import { db } from '@/db'
import Link from 'next/link'
import { AdminToolsList } from '@/components/admin/AdminToolsList'

export const dynamic = 'force-dynamic'

export default async function AdminToolsPage() {
  const tools = await db.aiTool.findMany({
    include: {
      category: { select: { name: true } },
      vendor: { select: { fullName: true, email: true } },
      _count: {
        select: {
          reviews: true,
          purchases: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
          <p className="text-gray-600">Manage all AI tools in your marketplace</p>
        </div>
        <Link
          href="/admin/tools/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Tool
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {tool.images[0] ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={tool.images[0]}
                            alt={tool.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">🛠️</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tool.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {tool.shortDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tool.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tool.vendor.fullName || tool.vendor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      {tool.dealPrice && (
                        <span className="text-gray-400 line-through">
                          ${tool.regularPrice.toString()}
                        </span>
                      )}
                      <span className="font-medium">
                        ${(tool.dealPrice || tool.regularPrice).toString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tool.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : tool.status === 'PENDING_REVIEW'
                          ? 'bg-yellow-100 text-yellow-800'
                          : tool.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tool.status.toLowerCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{tool._count.reviews} reviews</span>
                      <span>{tool._count.purchases} sales</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/tools/${tool.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-gray-600 hover:text-gray-900"
                        target="_blank"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🛠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No AI tools yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first AI tool to the marketplace.</p>
          <Link
            href="/admin/tools/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add First Tool
          </Link>
        </div>
      )}
    </div>
  )
} 