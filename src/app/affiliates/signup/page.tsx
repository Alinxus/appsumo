'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AffiliateApplicationForm } from '@/components/affiliate/AffiliateApplicationForm'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AffiliateSignupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
        // If user is already an affiliate, redirect to affiliate dashboard
        if (data?.profile?.affiliateCode) {
          router.push('/affiliate')
        }
      }
    } catch (error) {
      console.error('Error fetching affiliate data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    router.push('/affiliate')
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Affiliate Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start earning commissions by promoting high-quality AI tools and courses to your audience.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">High Commission Rates</h3>
            <p className="text-gray-600">
              Earn up to 10% commission on every sale. With our premium products, that adds up quickly!
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

        {/* Application Form */}
        {status === 'unauthenticated' ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sign in to Apply
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to apply for our affiliate program.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/register">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <AffiliateApplicationForm onSuccess={handleSuccess} />
        )}

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How much can I earn?
              </h3>
              <p className="text-gray-600">
                You can earn up to 10% commission on every sale. The exact rate depends on your promotional reach and audience size.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                When do I get paid?
              </h3>
              <p className="text-gray-600">
                Commissions are paid out monthly via PayPal or bank transfer, with a minimum payout threshold of $50.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What marketing materials do you provide?
              </h3>
              <p className="text-gray-600">
                We provide banners, product images, email templates, and detailed product information to help you promote effectively.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does approval take?
              </h3>
              <p className="text-gray-600">
                Most applications are reviewed within 24-48 hours. You'll receive an email notification once your application is processed.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
