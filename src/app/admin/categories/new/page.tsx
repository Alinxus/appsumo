import { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { CategoryForm } from '@/components/admin/CategoryForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Add New Category',
  description: 'Create a new category for AI tools',
}

export default async function NewCategoryPage() {
  await requireAdmin()
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600">Create a new category for AI tools in your marketplace</p>
        </div>
        
        <Link
          href="/admin/categories"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Back to Categories
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CategoryForm />
      </div>
    </div>
  )
} 