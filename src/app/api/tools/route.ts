import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'
  
  const skip = (page - 1) * limit

  let orderBy: any = { createdAt: 'desc' }
  
  switch (sort) {
    case 'price-low':
      orderBy = { dealPrice: 'asc' }
      break
    case 'price-high':
      orderBy = { dealPrice: 'desc' }
      break
    case 'popular':
      orderBy = { purchases: { _count: 'desc' } }
      break
    case 'rating':
      orderBy = { reviews: { _count: 'desc' } }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  const whereClause: any = {
    status: 'ACTIVE',
    ...(category && category !== 'all' && {
      category: { slug: category }
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { features: { hasSome: [search] } }
      ]
    })
  }

  try {
    const [tools, totalCount] = await Promise.all([
      db.aiTool.findMany({
        where: whereClause,
        include: {
          category: true,
          _count: { select: { reviews: true, purchases: true } }
        },
        orderBy,
        skip,
        take: limit
      }),
      db.aiTool.count({ where: whereClause })
    ])

    const hasMore = skip + limit < totalCount

    return NextResponse.json({
      tools,
      hasMore,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
} 