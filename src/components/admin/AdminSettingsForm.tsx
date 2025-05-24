'use client'

import { useState } from 'react'
import { AdminSettings } from '@prisma/client'

interface AdminSettingsFormProps {
  settings: AdminSettings
}

export function AdminSettingsForm({ settings }: AdminSettingsFormProps) {
  const [formData, setFormData] = useState({
    siteName: settings.siteName,
    siteDescription: settings.siteDescription || '',
    siteUrl: settings.siteUrl || '',
    heroTitle: settings.heroTitle || '',
    heroSubtitle: settings.heroSubtitle || '',
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
    enableNewsletter: settings.enableNewsletter,
    enableUserRegistration: settings.enableUserRegistration,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage || ''
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Failed to save settings. Please try again.')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                rows={3}
                value={formData.siteDescription}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Brief description of your marketplace"
              />
            </div>

            <div>
              <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
                Site URL
              </label>
              <input
                type="url"
                id="siteUrl"
                name="siteUrl"
                value={formData.siteUrl}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="https://yoursite.com"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Homepage Content</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">
                Hero Title
              </label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Discover AI Tools. Stay Innovative."
              />
            </div>

            <div>
              <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700">
                Hero Subtitle
              </label>
              <textarea
                id="heroSubtitle"
                name="heroSubtitle"
                rows={2}
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Top AI software deals for entrepreneurs..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Design</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="mt-1 flex items-center space-x-3">
                <input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="h-10 w-16 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  name="primaryColor"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">
                Accent Color
              </label>
              <div className="mt-1 flex items-center space-x-3">
                <input
                  type="color"
                  id="accentColor"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleChange}
                  className="h-10 w-16 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={handleChange}
                  name="accentColor"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableNewsletter"
                name="enableNewsletter"
                checked={formData.enableNewsletter}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="enableNewsletter" className="ml-2 block text-sm text-gray-900">
                Enable Newsletter Signup
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableUserRegistration"
                name="enableUserRegistration"
                checked={formData.enableUserRegistration}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="enableUserRegistration" className="ml-2 block text-sm text-gray-900">
                Enable User Registration
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                Maintenance Mode
              </label>
            </div>

            {formData.maintenanceMode && (
              <div>
                <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">
                  Maintenance Message
                </label>
                <textarea
                  id="maintenanceMessage"
                  name="maintenanceMessage"
                  rows={2}
                  value={formData.maintenanceMessage}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="We're currently updating our site..."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
} 