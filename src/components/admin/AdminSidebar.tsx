'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: '📊',
  },
  {
    name: 'AI Tools',
    href: '/admin/tools',
    icon: '🛠️',
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: '📁',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: '👥',
  },
  {
    name: 'Vendors',
    href: '/admin/vendors',
    icon: '🏪',
  },
  {
    name: 'Reviews',
    href: '/admin/reviews',
    icon: '⭐',
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: '📦',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: '📈',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="mr-3 text-base">{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2">Need help?</p>
          <Link 
            href="/admin/help" 
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View Documentation →
          </Link>
        </div>
      </div>
    </div>
  )
} 