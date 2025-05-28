import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

// Get all tools
export async function GET(request: NextRequest) {
  try {
    // Import auth only when needed to avoid build-time issues
    const { requireAdmin } = await import('@/lib/auth')
    
    try {
      await requireAdmin()
    } catch (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const tools = await db.aiTool.findMany({
      include: {
        category: true,
        vendor: true,
        _count: {
          select: {
            purchases: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ tools })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}

// Create new tool
export async function POST(request: NextRequest) {
  try {
    // Import auth only when needed to avoid build-time issues
    const { requireAdmin } = await import('@/lib/auth')
    
    try {
      await requireAdmin()
    } catch (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const data = await request.json()
    const { 
      name, 
      slug, 
      description, 
      shortDescription,
      categoryId,
      vendorId,
      regularPrice,
      dealPrice,
      discountPercentage,
      status,
      isFeatured,
      stockQuantity,
      images,
      features,
      fulfillmentMethod,
      websiteUrl,
      demoUrl,
      couponCode,
      redemptionUrl,
      platformCommission,
      vendorRevenue
    } = data
    
    if (!name || !slug || !categoryId || !vendorId) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }
    
    // Check if slug is already taken
    const existingTool = await db.aiTool.findUnique({
      where: { slug }
    })
    
    if (existingTool) {
      return NextResponse.json(
        { error: 'A tool with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Create the tool
    const tool = await db.aiTool.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        categoryId,
        vendorId,
        regularPrice,
        dealPrice,
        discountPercentage,
        status,
        isFeatured,
        stockQuantity,
        images,
        features,
        fulfillmentMethod,
        websiteUrl,
        demoUrl,
        couponCode,
        redemptionUrl,
        platformCommission,
        vendorRevenue
      }
    })
    
    return NextResponse.json(
      { 
        message: 'Tool created successfully',
        tool 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    )
  }
} 