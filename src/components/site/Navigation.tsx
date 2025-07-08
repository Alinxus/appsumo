'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState(session?.user?.role || 'USER')
  const [search, setSearch] = useState('')

  const switchRole = async (newRole: 'VENDOR' | 'USER') => {
    try {
      await update({
        ...session,
        user: {
          ...session?.user,
          role: newRole
        }
      })
      setCurrentRole(newRole)
      setIsRoleSwitcherOpen(false)
      if (newRole === 'VENDOR') {
        router.push('/vendor/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to switch role:', error)
    }
  }

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src='/logo1.jpeg' alt='logo' width={40} height={40} className="rounded" />
            </Link>
            
            <div className="hidden md:flex items-center ml-10 space-x-6">
              <Link href="/browse" className="text-sm text-gray-700 hover:text-black transition-colors">New products</Link>
              <Link href="/browse" className="text-sm text-gray-700 hover:text-black transition-colors">Ending soon</Link>
              <Link href="/tools" className="text-sm text-gray-700 hover:text-black transition-colors">Tools</Link>
              <Link href="/analytics" className="text-sm text-gray-700 hover:text-black transition-colors">Analytics</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative mx-4 hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && search.trim()) router.push(`/tools?search=${encodeURIComponent(search.trim())}`) }}
                className="bg-gray-100 text-sm text-gray-900 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:bg-white w-60 border border-gray-200"
              />
              <button
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-700"
                onClick={() => { if (search.trim()) router.push(`/tools?search=${encodeURIComponent(search.trim())}`) }}
                tabIndex={-1}
                aria-label="Search"
                type="button"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
            
            <div className="hidden md:flex items-center">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
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
                    <DropdownMenuItem asChild>
                      <div className="relative w-full">
                        <button
                          onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                          className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          Switch Role ({currentRole})
                        </button>
                        {isRoleSwitcherOpen && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                            <button
                              onClick={() => switchRole('USER')}
                              className={`block w-full text-left px-4 py-2 text-sm ${currentRole === 'USER' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              Consumer
                            </button>
                            <button
                              onClick={() => switchRole('VENDOR')}
                              className={`block w-full text-left px-4 py-2 text-sm ${currentRole === 'VENDOR' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              Vendor
                            </button>
                          </div>
                        )}
                      </div>
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
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex md:hidden p-2 rounded-md text-gray-500 hover:text-black focus:outline-none"
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
        <div className="md:hidden bg-white border-t border-gray-200 pb-3 pt-2 shadow">
          <div className="px-4 space-y-1">
            <Link href="/browse" className="block py-2 text-base text-gray-700 hover:text-black">New products</Link>
            <Link href="/browse" className="block py-2 text-base text-gray-700 hover:text-black">Ending soon</Link>
            <Link href="/tools" className="block py-2 text-base text-gray-700 hover:text-black">Tools</Link>
            <Link href="/analytics" className="block py-2 text-base text-gray-700 hover:text-black">Analytics</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2 text-base text-gray-700 hover:text-black">Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="mt-2 block w-full text-left py-2 text-base text-gray-700 hover:text-black">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 text-base text-gray-700 hover:text-black">Log in</Link>
                <Link href="/auth/register" className="mt-2 block bg-gray-900 text-white text-center py-2 px-4 rounded">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}