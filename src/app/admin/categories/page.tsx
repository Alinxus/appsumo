import { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'
import { CategoryList } from '@/components/admin/CategoryList'
import { AddCategoryButton } from '@/components/admin/AddCategoryButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Category Management',
  description: 'Manage AI tool categories',
}

export default async function CategoriesPage() {
  await requireAdmin()
  
  const categories = await db.category.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { name: 'asc' }
    ]
  })
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage AI tool categories for your marketplace</p>
        </div>
        
        <AddCategoryButton />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CategoryList categories={categories} />
      </div>
    </div>
  )
} 