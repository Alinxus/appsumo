'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'USER' | 'VENDOR'>('USER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          password,
          fullName,
          role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Registration successful, but login failed. Please try logging in.')
        return
      }

      if (role === 'VENDOR') {
        router.push('/vendor/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        setError('Failed to sign in with Google')
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="mt-1">
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Must be at least 8 characters long
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Account Type
        </label>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="user"
              name="role"
              type="radio"
              value="USER"
              checked={role === 'USER'}
              onChange={(e) => setRole(e.target.value as 'USER' | 'VENDOR')}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="user" className="ml-3 block text-sm text-gray-900">
              <span className="font-medium">Customer</span>
              <p className="text-gray-500 text-xs">Browse and purchase AI tools</p>
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="vendor"
              name="role"
              type="radio"
              value="VENDOR"
              checked={role === 'VENDOR'}
              onChange={(e) => setRole(e.target.value as 'USER' | 'VENDOR')}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <label htmlFor="vendor" className="ml-3 block text-sm text-gray-900">
              <span className="font-medium">Vendor</span>
              <p className="text-gray-500 text-xs">Sell your AI tools on the marketplace</p>
            </label>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="ml-2">Google</span>
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        By creating an account, you agree to our{' '}
        <a href="/tos" className="text-green-600 hover:text-green-500">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy-policy" className="text-green-600 hover:text-green-500">
          Privacy Policy
        </a>
        .
      </div>
    </form>
  )
} 