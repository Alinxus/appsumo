import { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Order Management',
  description: 'Manage orders on your marketplace',
}

export default async function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  await requireAdmin()
  
  // Get status filter from query params
  const statusFilter = searchParams.status?.toUpperCase()
  
  // Construct where clause based on status filter
  const where = statusFilter ? { status: statusFilter } : {}
  
  // Fetch orders with related data
  const orders = await db.purchase.findMany({
    where,
    include: {
      tool: {
        select: {
          id: true,
          name: true,
          slug: true,
          regularPrice: true,
          dealPrice: true,
          vendorId: true,
          vendor: {
            select: {
              id: true,
              email: true,
              fullName: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          email: true,
          fullName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  // Calculate order stats
  const totalOrders = orders.length
  const totalRevenue = orders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + Number(order.pricePaid), 0)
  
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED').length
  const refundedOrders = orders.filter(order => order.status === 'REFUNDED').length
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage orders and transactions on your marketplace</p>
        </div>
      </div>
      
      {/* Order Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalOrders}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{pendingOrders}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{completedOrders}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Refunded</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{refundedOrders}</dd>
          </div>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              !statusFilter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Orders
          </Link>
          <Link
            href="/admin/orders?status=pending"
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              statusFilter === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/orders?status=completed"
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              statusFilter === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </Link>
          <Link
            href="/admin/orders?status=cancelled"
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              statusFilter === 'CANCELLED' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelled
          </Link>
          <Link
            href="/admin/orders?status=refunded"
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              statusFilter === 'REFUNDED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Refunded
          </Link>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {statusFilter ? `${statusFilter.charAt(0)}${statusFilter.slice(1).toLowerCase()} Orders` : 'All Orders'}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user.fullName || 'Unnamed User'}</div>
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.tool.name}</div>
                      <div className="text-xs text-gray-500">
                        <Link href={`/tools/${order.tool.slug}`} className="text-blue-600 hover:underline">
                          View Tool
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Number(order.pricePaid).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        order.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={async () => {
                            // In a real implementation, this would be a form with CSRF protection
                            const res = await fetch(`/api/admin/orders/${order.id}/complete`, {
                              method: 'POST'
                            })
                            if (res.ok) window.location.reload()
                          }}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Complete
                        </button>
                      )}
                      {(order.status === 'PENDING' || order.status === 'COMPLETED') && (
                        <button
                          onClick={async () => {
                            // In a real implementation, this would be a form with CSRF protection
                            if (confirm(`Are you sure you want to refund this order?`)) {
                              const res = await fetch(`/api/admin/orders/${order.id}/refund`, {
                                method: 'POST'
                              })
                              if (res.ok) window.location.reload()
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 