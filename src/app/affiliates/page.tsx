'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { AffiliateLandingHero } from '@/components/affiliate/AffiliateLandingHero'
import { AffiliateStatsSection } from '@/components/affiliate/AffiliateStatsSection'
import { AffiliateBenefitsSection } from '@/components/affiliate/AffiliateBenefitsSection'
import { AffiliateTestimonials } from '@/components/affiliate/AffiliateTestimonials'
import { AffiliateDashboard } from '@/components/affiliate/AffiliateDashboard'

export default function AffiliateLandingPage() {
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

  const handleSignupClick = () => {
    if (status === 'unauthenticated') {
      window.location.href = '/auth/login?redirect=/affiliates/signup'
    } else {
      window.location.href = '/affiliates/signup'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    )
  }

  // If user is already an affiliate, show dashboard
  if (affiliateData?.profile?.affiliateCode) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AffiliateDashboard data={affiliateData} onRefresh={fetchAffiliateData} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <AffiliateLandingHero onSignupClick={handleSignupClick} />
      
      {/* Stats Section */}
      <AffiliateStatsSection />
      
      {/* Benefits Section */}
      <AffiliateBenefitsSection />
      
      {/* Testimonials */}
      <AffiliateTestimonials />
      
      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful affiliates who are earning passive income 
            by promoting the best AI tools on the market.
          </p>
          <button
            onClick={handleSignupClick}
            className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Apply to Become an Affiliate
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Free to join • 5-minute approval • Start earning immediately
          </p>
        </div>
      </section>

      <Footer />

    </div>
  )
}
