import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { getCurrentUser } from '@/lib/auth'

// Get license key statistics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.profile || (user.profile.role !== 'VENDOR' && user.profile.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tool = await db.aiTool.findFirst({
      where: {
        id: params.id,
        ...(user.profile.role === 'VENDOR' ? { vendorId: user.profile.id } : {})
      }
    })

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    const stats = await db.licenseKey.groupBy({
      by: ['isUsed'],
      where: { toolId: params.id },
      _count: true
    })

    const totalKeys = stats.reduce((sum, stat) => sum + stat._count, 0)
    const usedKeys = stats.find(stat => stat.isUsed)?._count || 0
    const availableKeys = totalKeys - usedKeys

    return NextResponse.json({
      totalKeys,
      usedKeys,
      availableKeys,
      lowStock: availableKeys < 10
    })
  } catch (error) {
    console.error('Error fetching license key stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch license key statistics' },
      { status: 500 }
    )
  }
}

// Add more license keys
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.profile || (user.profile.role !== 'VENDOR' && user.profile.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tool = await db.aiTool.findFirst({
      where: {
        id: params.id,
        ...(user.profile.role === 'VENDOR' ? { vendorId: user.profile.id } : {})
      }
    })

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    if (tool.fulfillmentMethod !== 'BULK_KEYS') {
      return NextResponse.json(
        { error: 'This tool does not use bulk license keys' },
        { status: 400 }
      )
    }

    const { licenseKeys } = await request.json()

    if (!licenseKeys || !Array.isArray(licenseKeys) || licenseKeys.length === 0) {
      return NextResponse.json(
        { error: 'License keys array is required' },
        { status: 400 }
      )
    }

    const licenseKeyData = licenseKeys
      .filter(key => key.trim())
      .map((key: string) => ({
        toolId: params.id,
        keyValue: key.trim()
      }))

    const result = await db.licenseKey.createMany({
      data: licenseKeyData,
      skipDuplicates: true
    })

    // Update total licenses count
    const totalCount = await db.licenseKey.count({
      where: { toolId: params.id }
    })

    await db.aiTool.update({
      where: { id: params.id },
      data: { totalLicenses: totalCount }
    })

    return NextResponse.json({
      message: `Successfully added ${result.count} new license keys`,
      totalAdded: result.count,
      skippedDuplicates: licenseKeys.length - result.count
    })
  } catch (error) {
    console.error('Error adding license keys:', error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Some license keys already exist. Please check for duplicates.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add license keys' },
      { status: 500 }
    )
  }
} 