import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/db'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = await db.profile.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not admin' }, { status: 403 })
  }
  const payouts = await db.affiliatePayout.findMany({
    orderBy: { createdAt: 'desc' },
    include: { affiliate: { select: { fullName: true, email: true } } }
  })
  return NextResponse.json(payouts.map(p => ({
    id: p.id,
    affiliateName: p.affiliate?.fullName || '',
    payoutEmail: p.payoutEmail,
    email: p.affiliate?.email || '',
    amount: p.amount,
    status: p.status
  })))
} 