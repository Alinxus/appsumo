'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AffiliateApplicationForm } from '@/components/affiliate/AffiliateApplicationForm'
import { AffiliateDashboard } from '@/components/affiliate/AffiliateDashboard'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'

export default function AffiliatePage() {
  const { data: session, status } = useSession()
  const [affiliateData, setAffiliateData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchAffiliateData()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [session, status])

  const fetchAffiliateData = async () => {
    try {
      const response = await fetch('/api/affiliate/dashboard')
      if (response.ok) {
        const data = await response.json()
        setAffiliateData(data)
      }
    } catch (error) {
      console.error('Error fetching affiliate data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Affiliate Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn up to 10% commission on every sale you refer. Promote amazing AI tools and courses 
            to your audience and start earning passive income today.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">High Commission Rates</h3>
            <p className="text-gray-600">
              Earn 10% commission on every sale. With our premium products, that adds up quickly!
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Products</h3>
            <p className="text-gray-600">
              Promote hand-picked AI tools and courses that your audience will love and trust.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Analytics</h3>
            <p className="text-gray-600">
              Track your performance, earnings, and conversions with our comprehensive dashboard.
            </p>
          </div>
        </div>

        {/* Main Content */}
        {status === 'unauthenticated' ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sign in to Apply
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to apply for our affiliate program.
            </p>
            <a
              href="/auth/login"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </a>
          </div>
        ) : affiliateData?.profile?.affiliateCode ? (
          <AffiliateDashboard data={affiliateData} onRefresh={fetchAffiliateData} />
        ) : (
          <AffiliateApplicationForm onSuccess={fetchAffiliateData} />
        )}
      </div>
      
      <Footer />
    </div>
  )
} 