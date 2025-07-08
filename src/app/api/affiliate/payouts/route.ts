import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/db'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const profile = await db.profile.findUnique({ where: { email: session.user.email } })
  if (!profile || profile.role !== 'AFFILIATE') {
    return NextResponse.json({ error: 'Not an affiliate' }, { status: 403 })
  }
  const payouts = await db.affiliatePayout.findMany({
    where: { affiliateId: profile.id },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(payouts)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const profile = await db.profile.findUnique({ where: { email: session.user.email }, include: { affiliateEarnings: true } })
  if (!profile || profile.role !== 'AFFILIATE') {
    return NextResponse.json({ error: 'Not an affiliate' }, { status: 403 })
  }
  const pendingEarnings = profile.affiliateEarnings.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + Number(e.amount), 0)
  if (pendingEarnings < 10) {
    return NextResponse.json({ error: 'Minimum $10 required to request payout' }, { status: 400 })
  }
  if (!profile.payoutEmail) {
    return NextResponse.json({ error: 'Payout email required' }, { status: 400 })
  }
  const payout = await db.affiliatePayout.create({
    data: {
      affiliateId: profile.id,
      amount: pendingEarnings,
      status: 'PENDING',
      payoutEmail: profile.payoutEmail
    }
  })
  // Optionally, mark earnings as requested
  await db.affiliateEarning.updateMany({
    where: { profileId: profile.id, status: 'PENDING' },
    data: { status: 'REQUESTED' }
  })
  return NextResponse.json(payout)
} 