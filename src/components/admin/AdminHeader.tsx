'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function AdminHeader() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState(session?.user?.role || 'ADMIN')
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false)

  const switchRole = async (newRole: 'ADMIN' | 'VENDOR' | 'USER') => {
    try {
      // This doesn't actually change the database role, just the session role for testing purposes
      await update({
        ...session,
        user: {
          ...session?.user,
          role: newRole
        }
      })
      
      setCurrentRole(newRole)
      setIsRoleSwitcherOpen(false)
      
      // Navigate to the appropriate dashboard based on role
      if (newRole === 'VENDOR') {
        router.push('/vendor/dashboard')
      } else if (newRole === 'USER') {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to switch role:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                className="flex items-center text-sm px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="mr-2">Role: <span className="font-medium">{currentRole}</span></span>
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isRoleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                  <button
                    onClick={() => switchRole('ADMIN')}
                    className={`block w-full text-left px-4 py-2 text-sm ${currentRole === 'ADMIN' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => switchRole('VENDOR')}
                    className={`block w-full text-left px-4 py-2 text-sm ${currentRole === 'VENDOR' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Vendor
                  </button>
                  <button
                    onClick={() => switchRole('USER')}
                    className={`block w-full text-left px-4 py-2 text-sm ${currentRole === 'USER' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    User
                  </button>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || session?.user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {currentRole}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(session?.user?.name || session?.user?.email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 