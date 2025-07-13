'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Tool } from '@/types/tool'
import FileUpload from '@/components/ui/FileUpload'
import MultiFileUpload from '@/components/ui/MultiFileUpload'
interface Category {
  id: string
  name: string
  slug: string
}

interface ToolFormProps {
  categories: Category[]
  tool?: any
}

export function ToolForm({ categories, tool }: ToolFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: tool?.name || '',
    slug: tool?.slug || '',
    shortDescription: tool?.shortDescription || '',
    description: tool?.description || '',
    categoryId: tool?.categoryId || '',
    regularPrice: tool?.regularPrice || '',
    dealPrice: tool?.dealPrice || '',
    discountPercentage: tool?.discountPercentage || '',
    dealStartsAt: tool?.dealStartsAt ? new Date(tool.dealStartsAt).toISOString().slice(0, 16) : '',
    dealEndsAt: tool?.dealEndsAt ? new Date(tool.dealEndsAt).toISOString().slice(0, 16) : '',
    totalLicenses: tool?.totalLicenses || '',
    images: tool?.images?.join('\n') || '',
    features: tool?.features?.join('\n') || '',
    requirements: tool?.requirements || '',
    demoUrl: tool?.demoUrl || '',
    websiteUrl: tool?.websiteUrl || '',
    licenseType: tool?.licenseType || 'Commercial',
    
    // AppSumo-style fulfillment
    fulfillmentMethod: tool?.fulfillmentMethod || 'MANUAL_FULFILLMENT',
    couponCode: tool?.couponCode || '',
    apiWebhookUrl: tool?.apiWebhookUrl || '',
    redemptionUrl: tool?.redemptionUrl || '',
    fulfillmentInstructions: tool?.fulfillmentInstructions || '',
    
    // License keys for bulk upload
    licenseKeys: '',
    
    // Commission (show but readonly - platform sets this)
    platformCommission: tool?.platformCommission || '70.00',
    vendorRevenue: tool?.vendorRevenue || '30.00',
    
    accessInstructions: tool?.accessInstructions || '',
    refundPolicy: tool?.refundPolicy || '',
    
    // Promo code fields
    promoCode: tool?.promoCode || '',
    promoDiscount: tool?.promoDiscount || '',
    promoValidUntil: tool?.promoValidUntil ? new Date(tool.promoValidUntil).toISOString().slice(0, 16) : ''
  })

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [bannerImage, setBannerImage] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'name' && !tool) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }

    if ((name === 'regularPrice' || name === 'dealPrice') && formData.regularPrice && formData.dealPrice) {
      const regular = parseFloat(name === 'regularPrice' ? value : formData.regularPrice)
      const deal = parseFloat(name === 'dealPrice' ? value : formData.dealPrice)
      if (regular > 0 && deal > 0) {
        const discount = Math.round(((regular - deal) / regular) * 100)
        setFormData(prev => ({ ...prev, discountPercentage: discount.toString() }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const submitData = {
        ...formData,
        regularPrice: parseFloat(formData.regularPrice),
        dealPrice: formData.dealPrice ? parseFloat(formData.dealPrice) : null,
        discountPercentage: formData.discountPercentage ? parseInt(formData.discountPercentage) : null,
        totalLicenses: formData.totalLicenses ? parseInt(formData.totalLicenses) : null,
        dealStartsAt: formData.dealStartsAt ? new Date(formData.dealStartsAt) : null,
        dealEndsAt: formData.dealEndsAt ? new Date(formData.dealEndsAt) : null,
        images: formData.images.split('\n').filter(url => url.trim()),
        features: formData.features.split('\n').filter(feature => feature.trim()),
        licenseKeys: formData.licenseKeys.split('\n').filter(key => key.trim())
      }

      const response = await fetch(tool ? `/api/vendor/tools/${tool.id}` : '/api/vendor/tools', {
        method: tool ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        setMessage(tool ? 'Tool updated successfully!' : 'Tool submitted successfully!')
        router.push('/vendor/dashboard')
      } else {
        const error = await response.json()
        setMessage(error.message || 'Something went wrong')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFulfillmentHelp = () => {
    switch (formData.fulfillmentMethod) {
      case 'BULK_KEYS':
        return 'Upload license keys that will be automatically distributed to customers upon purchase.'
      case 'COUPON_CODE':
        return 'Provide a coupon code that customers can use on your website to get the deal price.'
      case 'API_PROVISION':
        return 'We\'ll call your API to automatically create accounts for customers.'
      case 'MANUAL_FULFILLMENT':
        return 'You\'ll manually provide access to customers within 24-48 hours of purchase.'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-8">
      {/* Deal Overview Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-2">💰 Deal Structure Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Regular Price:</span>
            <div className="text-xl font-bold text-gray-900">
              ${formData.regularPrice || '0'}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Deal Price:</span>
            <div className="text-xl font-bold text-green-600">
              ${formData.dealPrice || '0'}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Your Revenue Per Sale:</span>
            <div className="text-xl font-bold text-blue-600">
              ${formData.dealPrice ? (parseFloat(formData.dealPrice) * 0.3).toFixed(2) : '0'}
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-600">
          Platform commission: 70% • Vendor revenue: 30% • Payment processing: ~3%
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">📝 Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tool Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., AI Content Generator Pro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ai-content-generator-pro"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline (appears in deal cards) *
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Generate unlimited AI content in seconds (max 100 characters)"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Detailed description of your AI tool, its capabilities, and benefits. This appears on your deal page..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Type
              </label>
              <select
                name="licenseType"
                value={formData.licenseType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Personal">Personal Use</option>
                <option value="Commercial">Commercial Use</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Deal Structure */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-black">💰 Pricing & Deal Structure</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regular Price ($) *
                <span className="text-xs text-gray-500 block">Your normal selling price</span>
              </label>
              <input
                type="number"
                name="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="997.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifetime Deal Price ($) *
                <span className="text-xs text-gray-500 block">Discounted price (80-95% off typical)</span>
              </label>
              <input
                type="number"
                name="dealPrice"
                value={formData.dealPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="59.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount %
                <span className="text-xs text-gray-500 block">Auto-calculated</span>
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-center text-2xl font-bold"
                placeholder="94%"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Starts At
              </label>
              <input
                type="datetime-local"
                name="dealStartsAt"
                value={formData.dealStartsAt}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Ends At *
                <span className="text-xs text-gray-500 block">Creates urgency</span>
              </label>
              <input
                type="datetime-local"
                name="dealEndsAt"
                value={formData.dealEndsAt}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Fulfillment Method */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">🚀 How Customers Get Access</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fulfillment Method *
            </label>
            <select
              name="fulfillmentMethod"
              value={formData.fulfillmentMethod}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="MANUAL_FULFILLMENT">Manual Fulfillment (24-48hrs)</option>
              <option value="BULK_KEYS">Bulk License Keys (Instant)</option>
              <option value="COUPON_CODE">Coupon Code (Customer redeems)</option>
              <option value="API_PROVISION">API Integration (Instant)</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">{getFulfillmentHelp()}</p>
          </div>

          {formData.fulfillmentMethod === 'BULK_KEYS' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Keys (one per line)
              </label>
              <textarea
                name="licenseKeys"
                value={formData.licenseKeys}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                placeholder="AISUMO-ABC-123-XYZ&#10;AISUMO-DEF-456-UVW&#10;AISUMO-GHI-789-RST&#10;..."
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  Upload at least 100 keys. We'll notify you when running low.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Licenses Available
                  </label>
                  <input
                    type="number"
                    name="totalLicenses"
                    value={formData.totalLicenses}
                    onChange={handleChange}
                    min="1"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.fulfillmentMethod === 'COUPON_CODE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                  placeholder="AISUMO94OFF"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redemption URL *
                </label>
                <input
                  type="url"
                  name="redemptionUrl"
                  value={formData.redemptionUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="https://yourtool.com/checkout"
                />
              </div>
            </div>
          )}

          {formData.fulfillmentMethod === 'API_PROVISION' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Webhook URL *
              </label>
              <input
                type="url"
                name="apiWebhookUrl"
                value={formData.apiWebhookUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://api.yourtool.com/aisumo/provision"
              />
              <p className="text-sm text-gray-600 mt-2">
                We'll POST customer data to this endpoint when a purchase is made.
              </p>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Access Instructions *
            </label>
            <textarea
              name="fulfillmentInstructions"
              value={formData.fulfillmentInstructions}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Step-by-step instructions for customers on how to access your tool after purchase..."
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-black">
          <h3 className="text-lg font-semibold mb-4 text-black">📋 Product Details</h3>
          
          {/* Banner Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image (Hero Image)
            </label>
            <FileUpload
              onFileSelect={setBannerImage}
              accept="image/*"
              className="border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white"
              label="Upload a high-quality banner image for your tool"
            />
            {bannerImage && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {bannerImage.name}
              </div>
            )}
          </div>

          {/* Product Screenshots */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Screenshots & Images
            </label>
            <MultiFileUpload
              onFilesSelect={setUploadedFiles}
              accept="image/*"
              maxFiles={10}
              className="border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white"
              label="Upload screenshots and product images (max 10 files)"
            />
            {uploadedFiles.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {uploadedFiles.length} file(s) selected
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Features (one per line) *
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="✅ Generate unlimited content&#10;✅ SEO-optimized articles&#10;✅ 50+ templates included&#10;✅ Multi-language support"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo URL
              </label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://demo.yourtool.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="https://yourtool.com"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Web browser, Internet connection, etc."
            />
          </div>
        </div>

        {/* Promo Codes & Marketing */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-black">🎯 Promo Codes & Marketing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code
                <span className="text-xs text-gray-500 block">Optional discount code</span>
              </label>
              <input
                type="text"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                placeholder="SAVE20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount ($)
                <span className="text-xs text-gray-500 block">Fixed amount off</span>
              </label>
              <input
                type="number"
                name="promoDiscount"
                value={formData.promoDiscount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="10.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until
                <span className="text-xs text-gray-500 block">Expiration date</span>
              </label>
              <input
                type="datetime-local"
                name="promoValidUntil"
                value={formData.promoValidUntil}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Marketing Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use high-quality screenshots showing your tool's interface</li>
              <li>• Banner image should be 1200x630px for optimal display</li>
              <li>• Highlight key features and benefits clearly</li>
              <li>• Include social proof or testimonials if available</li>
            </ul>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-black">📋 Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Instructions
                <span className="text-xs text-gray-500 block">How customers access your tool</span>
              </label>
              <textarea
                name="accessInstructions"
                value={formData.accessInstructions}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="1. Login to your account&#10;2. Go to dashboard&#10;3. Enter license key..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Policy
                <span className="text-xs text-gray-500 block">Your refund terms</span>
              </label>
              <textarea
                name="refundPolicy"
                value={formData.refundPolicy}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="60-day money-back guarantee. No questions asked."
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Submitting...' : tool ? 'Update Tool' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  )
} 