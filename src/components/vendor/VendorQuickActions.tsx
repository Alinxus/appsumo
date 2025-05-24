import Link from 'next/link'

export function VendorQuickActions() {
  const actions = [
    {
      title: 'Add New Tool',
      description: 'Submit a new AI tool to the marketplace',
      href: '/vendor/tools/new',
      icon: '➕',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'View Analytics',
      description: 'Track your tool performance and sales',
      href: '/vendor/analytics',
      icon: '📊',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Manage Tools',
      description: 'Edit and update your existing tools',
      href: '/vendor/tools',
      icon: '⚙️',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Check Reviews',
      description: 'See what customers are saying',
      href: '/vendor/reviews',
      icon: '⭐',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="space-y-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`block p-4 rounded-xl border-2 ${action.bgColor} ${action.borderColor} hover:shadow-md transition-all duration-200 group`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-2">💡 Vendor Tips</h4>
          <p className="text-sm text-gray-600 mb-4">
            Boost your sales with high-quality screenshots, detailed descriptions, and competitive pricing.
          </p>
          <Link
            href="/vendor/guide"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Read Vendor Guide
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
} 