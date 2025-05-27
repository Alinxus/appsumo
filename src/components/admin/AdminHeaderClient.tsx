'use client'

import { signOut } from 'next-auth/react'

interface AdminHeaderClientProps {
  user: {
    id: string
    email: string
    profile: {
      id: string
      email: string
      fullName: string | null
      role: string
    } | null
  } | null
}

export function AdminHeaderClient({ user }: AdminHeaderClientProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">AIsumo Admin</h1>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Admin
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-8h5v8z" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.profile?.fullName || user?.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user?.profile?.fullName || user?.email || '').charAt(0).toUpperCase()}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-gray-500 p-2"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 713-3h4a3 3 0 713 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 