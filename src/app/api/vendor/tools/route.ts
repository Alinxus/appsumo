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

    // Validate fulfillment method requirements
    if (data.fulfillmentMethod === 'COUPON_CODE' && (!data.couponCode || !data.redemptionUrl)) {
      return NextResponse.json(
        { error: 'Coupon code and redemption URL are required for coupon fulfillment' },
        { status: 400 }
      )
    }

    if (data.fulfillmentMethod === 'API_PROVISION' && !data.apiWebhookUrl) {
      return NextResponse.json(
        { error: 'API webhook URL is required for API fulfillment' },
        { status: 400 }
      )
    }

    if (data.fulfillmentMethod === 'BULK_KEYS' && (!data.licenseKeys || data.licenseKeys.length === 0)) {
      return NextResponse.json(
        { error: 'License keys are required for bulk key fulfillment' },
        { status: 400 }
      )
    }

    // Create the tool
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
        totalLicenses: data.totalLicenses,
        images: data.images,
        features: data.features,
        requirements: data.requirements,
        demoUrl: data.demoUrl,
        websiteUrl: data.websiteUrl,
        licenseType: data.licenseType,
        
        // AppSumo-style fulfillment
        fulfillmentMethod: data.fulfillmentMethod,
        couponCode: data.couponCode,
        apiWebhookUrl: data.apiWebhookUrl,
        redemptionUrl: data.redemptionUrl,
        fulfillmentInstructions: data.fulfillmentInstructions,
        
        // Commission structure (platform default: 70/30 split)
        platformCommission: 70.00,
        vendorRevenue: 30.00,
        
        accessInstructions: data.accessInstructions,
        refundPolicy: data.refundPolicy,
        status: 'PENDING_REVIEW'
      },
      include: {
        category: true
      }
    })

    // If bulk keys provided, create license keys
    if (data.fulfillmentMethod === 'BULK_KEYS' && data.licenseKeys && data.licenseKeys.length > 0) {
      const licenseKeyData = data.licenseKeys.map((key: string) => ({
        toolId: tool.id,
        keyValue: key.trim()
      }))

      await db.licenseKey.createMany({
        data: licenseKeyData,
        skipDuplicates: true
      })

      // Update total licenses count
      await db.aiTool.update({
        where: { id: tool.id },
        data: { totalLicenses: data.licenseKeys.length }
      })
    }

    return NextResponse.json({
      ...tool,
      message: 'Tool submitted successfully! It will be reviewed within 24-48 hours.'
    })
  } catch (error) {
    console.error('Error creating tool:', error)
    
    // Handle duplicate license key errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Some license keys already exist. Please check for duplicates.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    )
  }
} 