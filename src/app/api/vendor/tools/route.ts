import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.profile || (user.profile.role !== 'VENDOR' && user.profile.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    const existingSlug = await db.aiTool.findUnique({
      where: { slug: data.slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'A tool with this slug already exists' },
        { status: 400 }
      )
    }

    const tool = await db.aiTool.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        vendorId: user.profile.id,
        regularPrice: data.regularPrice,
        dealPrice: data.dealPrice,
        discountPercentage: data.discountPercentage,
        dealStartsAt: data.dealStartsAt,
        dealEndsAt: data.dealEndsAt,
        stockQuantity: data.stockQuantity,
        images: data.images,
        features: data.features,
        requirements: data.requirements,
        demoUrl: data.demoUrl,
        websiteUrl: data.websiteUrl,
        licenseType: data.licenseType,
        accessInstructions: data.accessInstructions,
        refundPolicy: data.refundPolicy,
        status: 'PENDING_REVIEW'
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    )
  }
} 