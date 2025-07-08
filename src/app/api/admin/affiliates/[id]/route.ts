import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { db } from '@/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = await db.profile.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not admin' }, { status: 403 })
  }
  const { status } = await request.json()
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  await db.profile.update({ where: { id: params.id }, data: { affiliateStatus: status } })
  return NextResponse.json({ success: true })
} 