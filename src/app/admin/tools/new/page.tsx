import { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import Link from 'next/link'
import { AdminToolForm } from '@/components/admin/AdminToolForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Add New AI Tool',
  description: 'Create a new AI tool listing',
}

export default async function NewToolPage() {
  await requireAdmin()
  
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })
  
  const vendors = await db.profile.findMany({
    where: { role: 'VENDOR' },
    orderBy: { fullName: 'asc' }
  })
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New AI Tool</h1>
          <p className="text-gray-600">Create a new AI tool listing in your marketplace</p>
        </div>
        
        <Link
          href="/admin/tools"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Back to Tools
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <AdminToolForm categories={categories} vendors={vendors} />
      </div>
    </div>
  )
} 