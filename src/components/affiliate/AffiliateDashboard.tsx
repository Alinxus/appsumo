'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AffiliateDashboardProps {
  data: any
  onRefresh: () => void
}

export function AffiliateDashboard({ data, onRefresh }: AffiliateDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [payoutEmail, setPayoutEmail] = useState(data.profile.payoutEmail || '')
  const [payoutMessage, setPayoutMessage] = useState('')
  const [isSavingPayout, setIsSavingPayout] = useState(false)
  const [payouts, setPayouts] = useState<any[]>([])
  const [isRequesting, setIsRequesting] = useState(false)

  const { profile, stats, recentReferrals, topProducts, recentEarnings } = data

  useEffect(() => {
    fetch('/api/affiliate/payouts').then(res => res.json()).then(setPayouts)
  }, [])

  const savePayoutInfo = async () => {
    setIsSavingPayout(true)
    setPayoutMessage('')
    try {
      const res = await fetch('/api/affiliate/payout-info', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutEmail })
      })
      if (!res.ok) throw new Error('Failed to update payout info')
      setPayoutMessage('Payout info updated!')
      onRefresh()
    } catch (e: any) {
      setPayoutMessage(e.message)
    } finally {
      setIsSavingPayout(false)
    }
  }

  const requestPayout = async () => {
    setIsRequesting(true)
    setPayoutMessage('')
    try {
      const res = await fetch('/api/affiliate/payouts', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to request payout')
      setPayoutMessage('Payout requested!')
      onRefresh()
    } catch (e: any) {
      setPayoutMessage(e.message)
    } finally {
      setIsRequesting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-gray-100 text-gray-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">
              Welcome back, Affiliate!
            </h2>
            <p className="text-gray-600">
              Your affiliate code: <span className="font-mono font-bold text-black bg-gray-100 px-2 py-1 rounded">{profile.affiliateCode}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${getStatusBadge(profile.affiliateStatus)}`}>
              {profile.affiliateStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <p className="text-sm text-gray-600">Pending Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${stats.pendingEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🛒</div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'earnings', label: 'Earnings', icon: '💰' },
              { id: 'referrals', label: 'Referrals', icon: '👥' },
              { id: 'products', label: 'Top Products', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h3>
                  <div className="space-y-3">
                    {recentEarnings.slice(0, 5).map((earning: any) => (
                      <div key={earning.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {earning.tool?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(earning.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">${earning.amount}</p>
                          <p className="text-xs text-gray-500">{earning.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Referrals</h3>
                  <div className="space-y-3">
                    {recentReferrals.slice(0, 5).map((referral: any) => (
                      <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {referral.referred.fullName || referral.referred.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">${referral.commissionEarned}</p>
                          <p className="text-xs text-gray-500">{referral.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Earnings</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentEarnings.map((earning: any) => (
                      <tr key={earning.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {earning.tool?.name || 'Product'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(earning.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          ${earning.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            earning.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            earning.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {earning.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Referrals</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentReferrals.map((referral: any) => (
                      <tr key={referral.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {referral.referred.fullName || referral.referred.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                          ${referral.commissionEarned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            referral.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {referral.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topProducts.map((product: any) => (
                  <div key={product.tool.id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{product.tool.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Earnings:</span>
                        <span className="font-semibold text-green-600">${product.totalEarnings.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sales:</span>
                        <span className="font-semibold text-blue-600">{product.sales}</span>
                      </div>
                    </div>
                    <Link
                      href={`/tools/${product.tool.slug}`}
                      className="mt-3 inline-block text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      View Product →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Affiliate Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Affiliate Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Affiliate Link
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}?ref=${profile.affiliateCode}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
              />
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}?ref=${profile.affiliateCode}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Browse Page Link
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/browse?ref=${profile.affiliateCode}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
              />
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/browse?ref=${profile.affiliateCode}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Info & Request */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Info</h3>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
          <input
            type="email"
            className="border px-4 py-2 rounded-lg w-full md:w-80 mb-2 md:mb-0"
            placeholder="PayPal Email"
            value={payoutEmail}
            onChange={e => setPayoutEmail(e.target.value)}
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            onClick={savePayoutInfo}
            disabled={isSavingPayout}
          >
            {isSavingPayout ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="text-sm text-green-700 mb-2">{payoutMessage}</div>
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            onClick={requestPayout}
            disabled={isRequesting || stats.pendingEarnings < 10}
          >
            {isRequesting ? 'Requesting...' : 'Request Payout'}
          </button>
          <span className="text-sm text-gray-500">Minimum $10 to request payout</span>
        </div>
      </div>

      {/* Payout History */}
      {payouts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">${p.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 