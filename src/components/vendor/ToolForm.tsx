'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    stockQuantity: tool?.stockQuantity || '',
    images: tool?.images?.join('\n') || '',
    features: tool?.features?.join('\n') || '',
    requirements: tool?.requirements || '',
    demoUrl: tool?.demoUrl || '',
    websiteUrl: tool?.websiteUrl || '',
    licenseType: tool?.licenseType || 'Commercial',
    accessInstructions: tool?.accessInstructions || '',
    refundPolicy: tool?.refundPolicy || ''
  })

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
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : null,
        dealStartsAt: formData.dealStartsAt ? new Date(formData.dealStartsAt) : null,
        dealEndsAt: formData.dealEndsAt ? new Date(formData.dealEndsAt) : null,
        images: formData.images.split('\n').filter(url => url.trim()),
        features: formData.features.split('\n').filter(feature => feature.trim())
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description *
        </label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          required
          maxLength={200}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Brief description that appears in listings (max 200 characters)"
        />
      </div>

      <div>
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
          placeholder="Detailed description of your AI tool, its capabilities, and benefits..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regular Price ($) *
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
            placeholder="299.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Price ($)
          </label>
          <input
            type="number"
            name="dealPrice"
            value={formData.dealPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="99.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount %
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            min="0"
            max="100"
            readOnly
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
            placeholder="Auto-calculated"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Deal Ends At
          </label>
          <input
            type="datetime-local"
            name="dealEndsAt"
            value={formData.dealEndsAt}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Screenshots/Images (one URL per line)
        </label>
        <textarea
          name="images"
          value={formData.images}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.png"
        />
      </div>

      <div>
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
          placeholder="Generate unlimited content&#10;SEO-optimized articles&#10;50+ templates included&#10;Multi-language support"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Access Instructions
        </label>
        <textarea
          name="accessInstructions"
          value={formData.accessInstructions}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Instructions for customers on how to access the tool after purchase..."
        />
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
          {isSubmitting ? 'Submitting...' : tool ? 'Update Tool' : 'Submit Tool'}
        </button>
      </div>
    </form>
  )
} 