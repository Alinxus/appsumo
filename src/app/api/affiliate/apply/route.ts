import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { website, bio, socialLinks, commissionRate } = await request.json()

    // Validate input
    if (!website || !bio) {
      return NextResponse.json({ error: 'Website and bio are required' }, { status: 400 })
    }

    // Check if user already has an affiliate code
    const existingProfile = await db.profile.findUnique({
      where: { email: session.user.email }
    })

    if (existingProfile?.affiliateCode) {
      return NextResponse.json({ error: 'Already an affiliate' }, { status: 400 })
    }

    // Generate unique affiliate code
    const affiliateCode = generateAffiliateCode()

    // Update profile with affiliate information
    const updatedProfile = await db.profile.update({
      where: { email: session.user.email },
      data: {
        affiliateCode,
        affiliateStatus: 'PENDING',
        affiliateCommission: commissionRate || 10.00,
        website,
        bio,
        socialLinks: socialLinks || {},
        role: 'AFFILIATE'
      }
    })

    return NextResponse.json({
      success: true,
      affiliateCode,
      message: 'Affiliate application submitted successfully'
    })

  } catch (error) {
    console.error('Affiliate application error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
} 