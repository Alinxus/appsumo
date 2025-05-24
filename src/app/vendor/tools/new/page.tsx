import { requireVendor } from '@/lib/auth'
import { db } from '@/db'
import { VendorNavigation } from '@/components/vendor/VendorNavigation'
import { ToolForm } from '@/components/vendor/ToolForm'

export default async function NewToolPage() {
  const user = await requireVendor()
  
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavigation user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New AI Tool</h1>
          <p className="text-gray-600 mt-2">
            Submit your AI tool to our marketplace and reach thousands of potential customers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <ToolForm categories={categories} />
        </div>
      </div>
    </div>
  )
} 