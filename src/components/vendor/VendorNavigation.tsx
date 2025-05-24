'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface VendorNavigationProps {
  user: {
    id: string
    email: string
    profile: {
      id: string
      email: string
      fullName: string | null
      role: string
    } | null
  }
}

export function VendorNavigation({ user }: VendorNavigationProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">AI</span>
              <span className="text-2xl font-bold text-green-600">sumo</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/vendor/dashboard" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/vendor/tools" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                My Tools
              </Link>
              <Link 
                href="/vendor/tools/new" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Add Tool
              </Link>
              <Link 
                href="/vendor/analytics" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Analytics
              </Link>
              <Link 
                href="/browse" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Browse Deals
              </Link>
              {user.profile?.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.profile?.fullName || user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  Vendor
                </p>
              </div>
              
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user.profile?.fullName || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-gray-500 p-2"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}