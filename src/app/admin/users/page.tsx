import { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage users on your marketplace',
}

export default async function UsersPage() {
  await requireAdmin()
  
  const users = await db.profile.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          purchases: true,
          reviews: true,
          wishlists: true
        }
      }
    }
  })
  
  // Calculate total users
  const totalUsers = users.length
  const adminCount = users.filter(user => user.role === 'ADMIN').length
  const vendorCount = users.filter(user => user.role === 'VENDOR').length
  const regularUserCount = totalUsers - adminCount - vendorCount
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users of your marketplace</p>
        </div>
      </div>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalUsers}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Regular Users</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{regularUserCount}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Vendors</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{vendorCount}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{adminCount}</dd>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.fullName || ''} 
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            {(user.fullName || user.email || '?').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName || 'Unnamed User'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'VENDOR' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._count.purchases}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._count.reviews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={async () => {
                          // In a real implementation, this would be a form with CSRF protection
                          const newRole = user.role === 'USER' ? 'VENDOR' : 'USER'
                          const res = await fetch(`/api/admin/users/${user.id}/role`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ role: newRole })
                          })
                          if (res.ok) window.location.reload()
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        {user.role === 'USER' ? 'Make Vendor' : 'Make User'}
                      </button>
                    )}
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={async () => {
                          // In a real implementation, this would be a form with CSRF protection
                          if (confirm(`Are you sure you want to deactivate ${user.fullName || user.email}?`)) {
                            const res = await fetch(`/api/admin/users/${user.id}/deactivate`, {
                              method: 'POST'
                            })
                            if (res.ok) window.location.reload()
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 