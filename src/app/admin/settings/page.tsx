import { db } from '@/db'
import { AdminSettingsForm } from '@/components/admin/AdminSettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  let settings = await db.adminSettings.findFirst()
  
  if (!settings) {
    settings = await db.adminSettings.create({
      data: {}
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600">Configure your AI tools marketplace</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <AdminSettingsForm settings={settings} />
      </div>
    </div>
  )
} 