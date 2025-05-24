'use client'

import { useState, useEffect } from 'react'

interface LicenseStats {
  totalKeys: number
  usedKeys: number
  availableKeys: number
  lowStock: boolean
}

interface LicenseKeyManagerProps {
  toolId: string
  toolName: string
  fulfillmentMethod: string
}

export function LicenseKeyManager({ toolId, toolName, fulfillmentMethod }: LicenseKeyManagerProps) {
  const [stats, setStats] = useState<LicenseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddKeys, setShowAddKeys] = useState(false)
  const [newKeys, setNewKeys] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStats()
  }, [toolId])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/vendor/tools/${toolId}/license-keys`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching license stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeys = async () => {
    if (!newKeys.trim()) return

    setIsSubmitting(true)
    setMessage('')

    try {
      const licenseKeys = newKeys.split('\n').filter(key => key.trim())
      
      const response = await fetch(`/api/vendor/tools/${toolId}/license-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKeys })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`✅ Successfully added ${result.totalAdded} license keys`)
        setNewKeys('')
        setShowAddKeys(false)
        fetchStats()
      } else {
        setMessage(`❌ ${result.error}`)
      }
    } catch (error) {
      setMessage('❌ Failed to add license keys')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (fulfillmentMethod !== 'BULK_KEYS') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-blue-600 mr-3">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-900">Fulfillment Method: {fulfillmentMethod.replace('_', ' ')}</h4>
            <p className="text-sm text-blue-700 mt-1">
              {fulfillmentMethod === 'COUPON_CODE' && 'Customers will receive a coupon code to redeem on your website.'}
              {fulfillmentMethod === 'API_PROVISION' && 'Customer accounts will be automatically created via API.'}
              {fulfillmentMethod === 'MANUAL_FULFILLMENT' && 'You will manually provide access to customers within 24-48 hours.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Failed to load license key statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* License Key Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">License Key Management</h3>
          <button
            onClick={() => setShowAddKeys(!showAddKeys)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add More Keys
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalKeys}</div>
            <div className="text-sm text-blue-700">Total Keys</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.availableKeys}</div>
            <div className="text-sm text-green-700">Available</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.usedKeys}</div>
            <div className="text-sm text-gray-700">Used</div>
          </div>
        </div>

        {/* Low Stock Warning */}
        {stats.lowStock && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-orange-600 mr-3">⚠️</div>
              <div>
                <h4 className="font-medium text-orange-900">Low Stock Alert</h4>
                <p className="text-sm text-orange-700 mt-1">
                  You have {stats.availableKeys} license keys remaining. Add more keys to avoid fulfillment delays.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Key Usage</span>
            <span>{Math.round((stats.usedKeys / stats.totalKeys) * 100)}% used</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.usedKeys / stats.totalKeys) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add License Keys Form */}
      {showAddKeys && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Add License Keys</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Keys (one per line)
            </label>
            <textarea
              value={newKeys}
              onChange={(e) => setNewKeys(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
              placeholder="AISUMO-ABC-123-XYZ&#10;AISUMO-DEF-456-UVW&#10;AISUMO-GHI-789-RST&#10;..."
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">
                Keys to add: {newKeys.split('\n').filter(key => key.trim()).length}
              </p>
              <div className="text-sm text-gray-500">
                💡 Use unique identifiers to avoid duplicates
              </div>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddKeys(false)
                setNewKeys('')
                setMessage('')
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddKeys}
              disabled={isSubmitting || !newKeys.trim()}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add Keys'}
            </button>
          </div>
        </div>
      )}

      {/* AppSumo Business Model Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h4 className="text-lg font-semibold text-green-900 mb-3">🚀 How It Works</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-green-800 mb-2">For You (Vendor):</h5>
            <ul className="text-green-700 space-y-1">
              <li>• Massive customer acquisition</li>
              <li>• 30% revenue share on each sale</li>
              <li>• Automated license distribution</li>
              <li>• Full sales analytics</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-800 mb-2">For Customers:</h5>
            <ul className="text-blue-700 space-y-1">
              <li>• Instant license key delivery</li>
              <li>• Lifetime access guarantee</li>
              <li>• 60-day money-back guarantee</li>
              <li>• Premium support included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 