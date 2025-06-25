'use client'

import { useState } from 'react'

interface AffiliateApplicationFormProps {
  onSuccess: () => void
}

export function AffiliateApplicationForm({ onSuccess }: AffiliateApplicationFormProps) {
  const [formData, setFormData] = useState({
    website: '',
    bio: '',
    commissionRate: 10,
    socialLinks: {
      twitter: '',
      linkedin: '',
      youtube: '',
      instagram: ''
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Application submitted successfully! We\'ll review it within 24-48 hours.')
        onSuccess()
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Apply to Become an Affiliate
      </h2>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Website/Blog URL *
          </label>
          <input
            type="url"
            id="website"
            required
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="https://yourwebsite.com"
          />
          <p className="text-sm text-gray-500 mt-1">
            Where will you be promoting our products?
          </p>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Tell us about yourself and your audience *
          </label>
          <textarea
            id="bio"
            required
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Describe your audience, content focus, and why you'd be a great affiliate partner..."
          />
        </div>

        <div>
          <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Commission Rate (%)
          </label>
          <select
            id="commissionRate"
            value={formData.commissionRate}
            onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={8}>8% - Standard Rate</option>
            <option value={10}>10% - Premium Rate</option>
            <option value={12}>12% - VIP Rate (High Volume)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Commission rates are based on your audience size and promotional reach
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Social Media Profiles (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="twitter" className="block text-xs text-gray-600 mb-1">
                Twitter/X
              </label>
              <input
                type="url"
                id="twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://twitter.com/username"
              />
            </div>
            
            <div>
              <label htmlFor="linkedin" className="block text-xs text-gray-600 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                id="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
            <div>
              <label htmlFor="youtube" className="block text-xs text-gray-600 mb-1">
                YouTube
              </label>
              <input
                type="url"
                id="youtube"
                value={formData.socialLinks.youtube}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://youtube.com/@channel"
              />
            </div>
            
            <div>
              <label htmlFor="instagram" className="block text-xs text-gray-600 mb-1">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We'll review your application within 24-48 hours</li>
            <li>• If approved, you'll receive your unique affiliate code</li>
            <li>• Start promoting and earning commissions immediately</li>
            <li>• Get access to our affiliate dashboard and marketing materials</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
} 