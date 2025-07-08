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
  const affiliates = await db.profile.findMany({
    where: { role: 'AFFILIATE' },
    select: { id: true, fullName: true, email: true, affiliateStatus: true }
  })
  return NextResponse.json(affiliates)
} 