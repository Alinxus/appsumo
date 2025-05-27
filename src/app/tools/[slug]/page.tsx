import { notFound } from 'next/navigation'
import { db } from '@/db'
import { ToolDetailHero } from '@/components/tools/ToolDetailHero'
import { ToolFeatures } from '@/components/tools/ToolFeatures'
import { ToolReviews } from '@/components/tools/ToolReviews'
import { ToolFAQ } from '@/components/tools/ToolFAQ'
import { SimilarTools } from '@/components/tools/SimilarTools'
import { Navigation } from '@/components/site/Navigation'
import { Footer } from '@/components/site/Footer'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = await db.aiTool.findUnique({
    where: { slug: params.slug },
    select: { name: true, shortDescription: true }
  })

  if (!tool) {
    return {
      title: 'Tool Not Found'
    }
  }

  return {
    title: `${tool.name} - Lifetime Deal | AIsumo`,
    description: tool.shortDescription || `Get ${tool.name} lifetime deal on AIsumo`
  }
}

export default async function ToolDetailPage({ params }: PageProps) {
  const tool = await db.aiTool.findUnique({
    where: { 
      slug: params.slug,
      status: 'ACTIVE'
    },
    include: {
      category: true,
      vendor: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          reviews: true,
          purchases: true
        }
      }
    }
  })

  if (!tool) {
    notFound()
  }

  const averageRating = tool.reviews.length > 0 
    ? tool.reviews.reduce((sum, review) => sum + review.rating, 0) / tool.reviews.length
    : 0

  const similarTools = await db.aiTool.findMany({
    where: {
      categoryId: tool.categoryId,
      id: { not: tool.id },
      status: 'ACTIVE'
    },
    include: {
      category: true,
      _count: { select: { reviews: true } }
    },
    take: 4
  })

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <ToolDetailHero 
        tool={tool} 
        averageRating={averageRating}
        totalReviews={tool._count.reviews}
        totalPurchases={tool._count.purchases}
      />
      
      <ToolFeatures tool={tool} />
      
      <ToolReviews 
        reviews={tool.reviews}
        averageRating={averageRating}
        totalReviews={tool._count.reviews}
        toolId={tool.id}
      />
      
      <ToolFAQ />
      
      <SimilarTools tools={similarTools} />
      
      <Footer />
    </div>
  )
} 