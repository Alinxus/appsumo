import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/db'

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const profile = await db.profile.findUnique({ where: { email: session.user.email } })
  if (!profile || profile.role !== 'AFFILIATE') {
    return NextResponse.json({ error: 'Not an affiliate' }, { status: 403 })
  }
  const { payoutEmail } = await request.json()
  if (!payoutEmail) {
    return NextResponse.json({ error: 'Payout email required' }, { status: 400 })
  }
  await db.profile.update({ where: { id: profile.id }, data: { payoutEmail } })
  return NextResponse.json({ success: true })
} 