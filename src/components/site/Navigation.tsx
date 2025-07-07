'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  
  return (
    <nav className="bg-[#122438] text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src='/logo1' alt='logo'/>
            </Link>
            
            <div className="hidden md:flex items-center ml-10 space-x-8">
              <div className="relative group">
                <button className="flex items-center text-sm text-gray-300 hover:text-white">
                  Software
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="relative group">
                <button className="flex items-center text-sm text-gray-300 hover:text-white">
                  Content & Media
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <Link href="/browse" className="text-sm text-gray-300 hover:text-white">
                New products
              </Link>
              
              <Link href="/browse" className="text-sm text-gray-300 hover:text-white">
                Ending soon
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative mx-4 hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-800 text-sm text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:bg-gray-700 w-60"
              />
            </div>
            
            <div className="hidden md:flex items-center">
              {session ? (
                <UserMenu user={session.user} />
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm text-gray-300 hover:text-white mx-4"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-[#00b289] text-white text-sm px-4 py-2 rounded font-medium hover:bg-[#00a07a] transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 pb-3 pt-2">
          <div className="px-4 space-y-1">
            <Link
              href="/browse"
              className="block py-2 text-base text-gray-300 hover:text-white"
            >
              Software
            </Link>
            <Link
              href="/browse"
              className="block py-2 text-base text-gray-300 hover:text-white"
            >
              Content & Media
            </Link>
            <Link
              href="/browse"
              className="block py-2 text-base text-gray-300 hover:text-white"
            >
              New products
            </Link>
            <Link
              href="/browse"
              className="block py-2 text-base text-gray-300 hover:text-white"
            >
              Ending soon
            </Link>
            
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-base text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="mt-2 block w-full text-left py-2 text-base text-gray-300 hover:text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-2 text-base text-gray-300 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="mt-2 block bg-[#00b289] text-white text-center py-2 px-4 rounded"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function UserMenu({ user }: { user: any }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex items-center space-x-3">
      <Link
        href="/dashboard"
        className="text-sm text-gray-300 hover:text-white"
      >
        Dashboard
      </Link>
      
      {user.role === 'ADMIN' && (
        <Link
          href="/admin"
          className="text-sm text-gray-300 hover:text-white"
        >
          Admin Panel
        </Link>
      )}
      
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#00b289] rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </span>
        </div>
        
        <button
          onClick={handleSignOut}
          className="text-gray-400 hover:text-gray-300 p-1"
          title="Sign out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      <Link
        href="/auth/login"
        className="text-gray-700 hover:text-green-600 font-medium"
      >
        Sign In
      </Link>
      <Link
        href="/auth/register"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Get Started
      </Link>
    </div>
  )
} 