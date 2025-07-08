import { db } from '@/db'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { DealsGrid } from '@/components/site/DealsGrid'

export const dynamic = 'force-dynamic'

export default async function ToolsPage() {
  const tools = await db.aiTool.findMany({
    where: { status: 'ACTIVE' },
    include: {
      category: true,
      vendor: { select: { fullName: true, email: true } },
      _count: { select: { reviews: true } }
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 24
  })

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All AI Tools</h1>
        <DealsGrid tools={tools} />
      </div>
      <Footer />
    </div>
  )
} 