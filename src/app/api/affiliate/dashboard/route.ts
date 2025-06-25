import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await db.profile.findUnique({
      where: { email: session.user.email },
      include: {
        referrals: {
          include: {
            referred: {
              select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true
              }
            }
          }
        },
        affiliateEarnings: {
          include: {
            tool: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!profile || profile.role !== 'AFFILIATE') {
      return NextResponse.json({ error: 'Not an affiliate' }, { status: 403 })
    }

    // Calculate earnings
    const totalEarnings = profile.affiliateEarnings
      .filter(earning => earning.status === 'PAID')
      .reduce((sum, earning) => sum + Number(earning.amount), 0)

    const pendingEarnings = profile.affiliateEarnings
      .filter(earning => earning.status === 'PENDING')
      .reduce((sum, earning) => sum + Number(earning.amount), 0)

    // Get recent referrals
    const recentReferrals = profile.referrals.slice(0, 10)

    // Get top performing products
    const productEarnings = profile.affiliateEarnings.reduce((acc, earning) => {
      if (earning.tool) {
        const toolId = earning.tool.id
        if (!acc[toolId]) {
          acc[toolId] = {
            tool: earning.tool,
            totalEarnings: 0,
            sales: 0
          }
        }
        acc[toolId].totalEarnings += Number(earning.amount)
        acc[toolId].sales += 1
      }
      return acc
    }, {} as Record<string, any>)

    const topProducts = Object.values(productEarnings)
      .sort((a: any, b: any) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5)

    return NextResponse.json({
      profile: {
        affiliateCode: profile.affiliateCode,
        affiliateStatus: profile.affiliateStatus,
        affiliateCommission: profile.affiliateCommission,
        totalEarnings: profile.totalEarnings,
        referralCount: profile.referralCount,
        website: profile.website,
        bio: profile.bio,
        socialLinks: profile.socialLinks
      },
      stats: {
        totalEarnings,
        pendingEarnings,
        totalReferrals: profile.referrals.length,
        totalSales: profile.affiliateEarnings.length
      },
      recentReferrals,
      topProducts,
      recentEarnings: profile.affiliateEarnings.slice(0, 10)
    })

  } catch (error) {
    console.error('Affiliate dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 