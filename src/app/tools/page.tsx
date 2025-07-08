import { db } from '@/db'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { DealsGrid } from '@/components/site/DealsGrid'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ToolsPage({ searchParams }: { searchParams?: { search?: string } }) {
  const search = searchParams?.search?.trim() || ''
  const tools = await db.aiTool.findMany({
    where: {
      status: 'ACTIVE',
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } }
        ]
      })
    },
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{search ? `Search results for "${search}"` : 'All AI Tools'}</h1>
        <DealsGrid tools={tools} />
      </div>
      <Footer />
    </div>
  )
} 