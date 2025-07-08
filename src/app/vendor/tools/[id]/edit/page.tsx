import { requireVendor } from '@/lib/auth'
import { db } from '@/db'
import { VendorNavigation } from '@/components/vendor/VendorNavigation'
import { ToolForm } from '@/components/vendor/ToolForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface EditToolPageProps {
  params: { id: string }
}

export default async function EditToolPage({ params }: EditToolPageProps) {
  const user = await requireVendor()
  const tool = await db.aiTool.findUnique({
    where: { id: params.id, vendorId: user.profile!.id },
    include: { category: true }
  })
  if (!tool) return notFound()

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorNavigation user={user} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit AI Tool</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <ToolForm categories={categories} tool={tool} />
        </div>
      </div>
    </div>
  )
} 