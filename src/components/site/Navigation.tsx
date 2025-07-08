'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const [search, setSearch] = useState('')

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and nav links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo1.jpeg" alt="logo" width={36} height={36} className="rounded" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">Atmet</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/browse" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Browse</Link>
              <Link href="/tools" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Tools</Link>
              <Link href="/analytics" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Analytics</Link>
              <Link href="/affiliate" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Affiliate</Link>
            </div>
          </div>

          {/* Search, notification, user */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && search.trim()) router.push(`/tools?search=${encodeURIComponent(search.trim())}`) }}
                className="bg-gray-100 text-sm text-gray-900 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:bg-white w-60 border border-gray-200"
              />
              <button
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-blue-600"
                onClick={() => { if (search.trim()) router.push(`/tools?search=${encodeURIComponent(search.trim())}`) }}
                tabIndex={-1}
                aria-label="Search"
                type="button"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
            {/* Notification bell placeholder */}
            <button className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            {/* User menu */}
            <div className="hidden md:flex items-center">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
                      <Avatar>
                        <span className="sr-only">User avatar</span>
                        <span className="text-base font-medium">{(session.user.name || session.user.email).charAt(0).toUpperCase()}</span>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    {session.user.role === 'ADMIN' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost" className="mx-2">
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex md:hidden p-2 rounded-md text-gray-500 hover:text-blue-600 focus:outline-none"
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
        <div className="md:hidden bg-white border-t border-gray-200 pb-3 pt-2 shadow">
          <div className="px-4 space-y-1">
            <Link href="/browse" className="block py-2 text-base text-gray-700 hover:text-blue-600">Browse</Link>
            <Link href="/tools" className="block py-2 text-base text-gray-700 hover:text-blue-600">Tools</Link>
            <Link href="/analytics" className="block py-2 text-base text-gray-700 hover:text-blue-600">Analytics</Link>
            <Link href="/affiliate" className="block py-2 text-base text-gray-700 hover:text-blue-600">Affiliate</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2 text-base text-gray-700 hover:text-blue-600">Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="mt-2 block w-full text-left py-2 text-base text-gray-700 hover:text-blue-600">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 text-base text-gray-700 hover:text-blue-600">Log in</Link>
                <Link href="/auth/register" className="mt-2 block bg-blue-600 text-white text-center py-2 px-4 rounded">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}