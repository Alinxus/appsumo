import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const type = searchParams.get('type') || 'all' // all, tools, courses
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Build where clause for search
    let where: any = {
      status: 'ACTIVE',
      OR: query ? [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { shortDescription: { contains: query, mode: 'insensitive' } },
        { features: { hasSome: [query] } },
      ] : undefined,
    }

    if (category) {
      where.categoryId = category
    }

    // Sort options
    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'price_low':
        orderBy = { dealPrice: 'asc' }
        break
      case 'price_high':
        orderBy = { dealPrice: 'desc' }
        break
      case 'popular':
        orderBy = { soldCount: 'desc' }
        break
      case 'rating':
        orderBy = { reviews: { _count: 'desc' } }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    let tools = []
    let courses = []
    let totalCount = 0

    // Search tools
    if (type === 'all' || type === 'tools') {
      const toolsResult = await db.aiTool.findMany({
        where: { ...where, productType: 'TOOL' },
        include: {
          category: true,
          vendor: { select: { fullName: true, email: true } },
          _count: { select: { reviews: true, purchases: true } },
          reviews: {
            select: { rating: true },
            take: 100
          }
        },
        orderBy,
        skip: offset,
        take: limit
      })
      tools = toolsResult
    }

    // Search courses
    if (type === 'all' || type === 'courses') {
      const coursesResult = await db.course.findMany({
        where: {
          ...where,
          name: query ? { contains: query, mode: 'insensitive' } : undefined
        },
        include: {
          category: true,
          vendor: { select: { fullName: true, email: true } },
          _count: { select: { purchases: true } }
        },
        orderBy,
        skip: offset,
        take: limit
      })
      courses = coursesResult
    }

    // Get total count
    const toolsCount = type === 'all' || type === 'tools' ? 
      await db.aiTool.count({ where: { ...where, productType: 'TOOL' } }) : 0
    const coursesCount = type === 'all' || type === 'courses' ? 
      await db.course.count({ where: { ...where } }) : 0
    totalCount = toolsCount + coursesCount

    // Get categories for filters
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    // Calculate average ratings
    const enhancedTools = tools.map(tool => ({
      ...tool,
      averageRating: tool.reviews.length > 0 ? 
        tool.reviews.reduce((sum, review) => sum + review.rating, 0) / tool.reviews.length : 0
    }))

    return NextResponse.json({
      success: true,
      data: {
        tools: enhancedTools,
        courses,
        categories,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
