'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Bell, Check } from 'lucide-react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isSwitchingRole, setIsSwitchingRole] = useState(false)

  async function handleRoleSwitch(newRole: 'USER' | 'VENDOR') {
    if (!session?.user?.id || session.user.role === newRole) return
    setIsSwitchingRole(true)
    try {
      await fetch('/api/user/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, role: newRole })
      })
      if (newRole === 'VENDOR') {
        router.push('/vendor/dashboard')
      } else {
        router.push('/dashboard')
      }
    } finally {
      setIsSwitchingRole(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and nav links */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
                <img src="/logo.jpeg" alt="Atmet Logo" />
              <span className="font-black text-2xl text-black tracking-tight">ATMET</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/tools" className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group">
                Tools
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link href="/courses" className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group">
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link href="/affiliates/signup" className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group">
                Affiliate
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link href="/vendor/dashboard" className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative group">
                Partner Portal
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Search Bar – now visible on mobile & responsive */}
          <div className="flex-1 mx-4 md:mx-8 max-w-xs md:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && search.trim()) {
                    router.push(`/tools?search=${encodeURIComponent(search.trim())}`)
                  }
                }}
                className="bg-gray-50 text-sm text-gray-900 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black w-full md:w-80 border border-gray-200 transition-all duration-200"
              />
              <button
                className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-black transition-colors"
                onClick={() => {
                  if (search.trim()) {
                    router.push(`/tools?search=${encodeURIComponent(search.trim())}`)
                  }
                }}
                tabIndex={-1}
                aria-label="Search"
                type="button"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </div>

          {/* Right side - Notifications and User menu */}
          <div className="flex items-center gap-3">
            {/* Notification bell placeholder */}
            <button className="hidden md:inline-flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors group" aria-label="Notifications">
              <Bell className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
            </button>

            {/* User menu */}
            <div className="hidden md:flex items-center">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-12 w-12 rounded-full border-2 border-black shadow-sm bg-white hover:ring-2 hover:ring-gray-300 transition-all flex items-center justify-center">
                      <Avatar className="h-12 w-12 bg-black border-none">
                        <span className="sr-only">User avatar</span>
                        <span className="text-lg font-bold text-white">
                          {(session?.user?.name || session?.user?.email).charAt(0).toUpperCase()}
                        </span>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    {/* Role Switcher */}
                    {(session?.user?.role === 'USER' || session?.user?.role === 'VENDOR') && (
                      <div className="px-2 py-1">
                        <div className="text-xs text-gray-500 mb-1">Switch Role</div>
                        <button
                          className={`flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${session.user.role === 'USER' ? 'font-semibold text-black bg-gray-50' : 'text-gray-700'}`}
                          disabled={isSwitchingRole || session?.user?.role === 'USER'}
                          onClick={() => handleRoleSwitch('USER')}
                        >
                          {session?.user?.role === 'USER' && <Check className="w-4 h-4 mr-2 text-black" />} User
                        </button>
                        <button
                          className={`flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${session.user.role === 'VENDOR' ? 'font-semibold text-black bg-gray-50' : 'text-gray-700'}`}
                          disabled={isSwitchingRole || session?.user?.role === 'VENDOR'}
                          onClick={() => handleRoleSwitch('VENDOR')}
                        >
                          {session?.user?.role === 'VENDOR' && <Check className="w-4 h-4 mr-2 text-black" />} Vendor
                        </button>
                      </div>
                    )}
                    {session?.user?.role === 'ADMIN' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost" className="mx-2 font-medium hover:bg-gray-100">
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild className="btn-primary">
                    <Link href="/auth/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex lg:hidden p-3 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 focus:outline-none transition-colors"
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

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 pb-6 pt-4 shadow-lg">
          <div className="px-4 space-y-3">
            <Link href="/browse" className="block py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 px-3 transition-colors">Browse</Link>
            <Link href="/tools" className="block py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 px-3 transition-colors">Tools</Link>
            <Link href="/courses" className="block py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 px-3 transition-colors">Courses</Link>
            <Link href="/affiliates/signup" className="block py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 px-3 transition-colors">Affiliate</Link>
            <Link href="/vendor/dashboard" className="block py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 px-3 transition-colors">Partner Portal</Link>

            {session ? (
              <>
                <Link href="/dashboard" className="block py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 px-3 transition-colors">Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="mt-3 block w-full text-left py-3 text-base font-medium text-gray-700 hover:text-black rounded-lg hover:bg-gray-50 px-3 transition-colors">Sign out</button>
              </>
            ) : (
              <>
                {/* Big primary button now acts as Login */}
                <Link href="/auth/login" className="mt-3 block bg-black text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">Log in</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
