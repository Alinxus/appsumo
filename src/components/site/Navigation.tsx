'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getCurrentUser } from '@/lib/auth'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">AI</span>
              <span className="text-2xl font-bold text-green-600">sumo</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/browse" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Browse Deals
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/vendors" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Become a Vendor
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Blog
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <AuthButtons />
            
            <button
              className="md:hidden p-2 text-gray-400 hover:text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link href="/browse" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Browse Deals
              </Link>
              <Link href="/categories" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Categories
              </Link>
              <Link href="/vendors" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Become a Vendor
              </Link>
              <Link href="/blog" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Blog
              </Link>
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
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