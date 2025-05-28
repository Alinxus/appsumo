'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AiTool, Category, Profile } from '@prisma/client'

interface AdminToolFormProps {
  categories: Category[]
  vendors: Profile[]
  tool?: AiTool & { category: Category, vendor: Profile }
  isEditing?: boolean
}

export function AdminToolForm({ categories, vendors, tool, isEditing = false }: AdminToolFormProps) {
  const router = useRouter()
  const [name, setName] = useState(tool?.name || '')
  const [slug, setSlug] = useState(tool?.slug || '')
  const [description, setDescription] = useState(tool?.description || '')
  const [shortDescription, setShortDescription] = useState(tool?.shortDescription || '')
  const [categoryId, setCategoryId] = useState(tool?.categoryId || categories[0]?.id || '')
  const [vendorId, setVendorId] = useState(tool?.vendorId || vendors[0]?.id || '')
  const [regularPrice, setRegularPrice] = useState(tool?.regularPrice?.toString() || '99.00')
  const [dealPrice, setDealPrice] = useState(tool?.dealPrice?.toString() || '49.00')
  const [discountPercentage, setDiscountPercentage] = useState(tool?.discountPercentage || 50)
  const [status, setStatus] = useState(tool?.status || 'DRAFT')
  const [isFeatured, setIsFeatured] = useState(tool?.isFeatured || false)
  const [stockQuantity, setStockQuantity] = useState(tool?.stockQuantity || 100)
  const [imagesStr, setImagesStr] = useState(tool?.images?.join(', ') || '')
  const [featuresStr, setFeaturesStr] = useState(tool?.features?.join('\n') || '')
  const [fulfillmentMethod, setFulfillmentMethod] = useState(tool?.fulfillmentMethod || 'BULK_KEYS')
  const [websiteUrl, setWebsiteUrl] = useState(tool?.websiteUrl || '')
  const [demoUrl, setDemoUrl] = useState(tool?.demoUrl || '')
  const [couponCode, setCouponCode] = useState(tool?.couponCode || '')
  const [redemptionUrl, setRedemptionUrl] = useState(tool?.redemptionUrl || '')
  const [platformCommission, setPlatformCommission] = useState(tool?.platformCommission || 70)
  const [vendorRevenue, setVendorRevenue] = useState(tool?.vendorRevenue || 30)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const images = imagesStr.split(',').map(img => img.trim()).filter(Boolean)
      const features = featuresStr.split('\n').map(feature => feature.trim()).filter(Boolean)
      
      const url = isEditing 
        ? `/api/admin/tools/${tool?.id}` 
        : '/api/admin/tools'
      
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          shortDescription,
          categoryId,
          vendorId,
          regularPrice: parseFloat(regularPrice),
          dealPrice: dealPrice ? parseFloat(dealPrice) : null,
          discountPercentage,
          status,
          isFeatured,
          stockQuantity,
          images,
          features,
          fulfillmentMethod,
          websiteUrl,
          demoUrl,
          couponCode,
          redemptionUrl,
          platformCommission,
          vendorRevenue
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save tool')
      }

      setSuccess(isEditing ? 'Tool updated successfully!' : 'Tool created successfully!')
      
      // Refresh the page data
      router.refresh()
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/tools')
      }, 1500)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    
    // Auto-generate slug from name if slug is empty or we're not editing
    if (!slug || !isEditing) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  const calculateDiscount = () => {
    if (regularPrice && dealPrice) {
      const regular = parseFloat(regularPrice)
      const deal = parseFloat(dealPrice)
      if (regular > 0 && deal > 0 && deal < regular) {
        const percentage = Math.round(((regular - deal) / regular) * 100)
        setDiscountPercentage(percentage)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tool Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL-friendly identifier (e.g., "ai-writing-tool")
          </p>
        </div>
      </div>
      
      <div>
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
          Short Description *
        </label>
        <input
          type="text"
          id="shortDescription"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Brief description (1-2 sentences)
        </p>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Full Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700">
            Vendor *
          </label>
          <select
            id="vendorId"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.fullName || vendor.email}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700">
            Regular Price ($) *
          </label>
          <input
            type="number"
            id="regularPrice"
            value={regularPrice}
            onChange={(e) => {
              setRegularPrice(e.target.value)
              calculateDiscount()
            }}
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="dealPrice" className="block text-sm font-medium text-gray-700">
            Deal Price ($)
          </label>
          <input
            type="number"
            id="dealPrice"
            value={dealPrice}
            onChange={(e) => {
              setDealPrice(e.target.value)
              calculateDiscount()
            }}
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
            Discount %
          </label>
          <input
            type="number"
            id="discountPercentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status *
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stockQuantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="imagesStr" className="block text-sm font-medium text-gray-700">
          Images (URLs, comma separated)
        </label>
        <textarea
          id="imagesStr"
          value={imagesStr}
          onChange={(e) => setImagesStr(e.target.value)}
          rows={2}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </div>
      
      <div>
        <label htmlFor="featuresStr" className="block text-sm font-medium text-gray-700">
          Features (one per line)
        </label>
        <textarea
          id="featuresStr"
          value={featuresStr}
          onChange={(e) => setFeaturesStr(e.target.value)}
          rows={5}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            id="websiteUrl"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
            Demo URL
          </label>
          <input
            type="url"
            id="demoUrl"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="fulfillmentMethod" className="block text-sm font-medium text-gray-700">
          Fulfillment Method *
        </label>
        <select
          id="fulfillmentMethod"
          value={fulfillmentMethod}
          onChange={(e) => setFulfillmentMethod(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="BULK_KEYS">Bulk License Keys</option>
          <option value="COUPON_CODE">Coupon Code</option>
          <option value="API_PROVISION">API Provision</option>
          <option value="MANUAL_FULFILLMENT">Manual Fulfillment</option>
        </select>
      </div>
      
      {fulfillmentMethod === 'COUPON_CODE' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700">
              Coupon Code
            </label>
            <input
              type="text"
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="redemptionUrl" className="block text-sm font-medium text-gray-700">
              Redemption URL
            </label>
            <input
              type="url"
              id="redemptionUrl"
              value={redemptionUrl}
              onChange={(e) => setRedemptionUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="platformCommission" className="block text-sm font-medium text-gray-700">
            Platform Commission (%)
          </label>
          <input
            type="number"
            id="platformCommission"
            value={platformCommission}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              setPlatformCommission(value)
              setVendorRevenue(100 - value)
            }}
            min="0"
            max="100"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="vendorRevenue" className="block text-sm font-medium text-gray-700">
            Vendor Revenue (%)
          </label>
          <input
            type="number"
            id="vendorRevenue"
            value={vendorRevenue}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              setVendorRevenue(value)
              setPlatformCommission(100 - value)
            }}
            min="0"
            max="100"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
            Featured Tool
          </label>
        </div>
      </div>
      
      <div className="flex justify-end pt-5">
        <button
          type="button"
          onClick={() => router.push('/admin/tools')}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Creating...') 
            : (isEditing ? 'Update Tool' : 'Create Tool')
          }
        </button>
      </div>
    </form>
  )
} 