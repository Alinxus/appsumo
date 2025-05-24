import Link from 'next/link'

const actions = [
  {
    title: 'Add New AI Tool',
    description: 'Create a new tool listing',
    href: '/admin/tools/new',
    icon: '➕',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Create Category',
    description: 'Add a new tool category',
    href: '/admin/categories/new',
    icon: '📁',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Approve Vendors',
    description: 'Review vendor applications',
    href: '/admin/vendors?status=pending',
    icon: '👨‍💼',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: 'Moderate Reviews',
    description: 'Review pending reviews',
    href: '/admin/reviews?status=pending',
    icon: '⭐',
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    title: 'Site Settings',
    description: 'Configure marketplace settings',
    href: '/admin/settings',
    icon: '⚙️',
    color: 'bg-gray-500 hover:bg-gray-600'
  },
  {
    title: 'View Analytics',
    description: 'Check performance metrics',
    href: '/admin/analytics',
    icon: '📊',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  }
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg text-white ${action.color} transition-colors duration-200`}>
                <span className="text-lg">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 