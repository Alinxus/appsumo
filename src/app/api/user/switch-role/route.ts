import { NextRequest, NextResponse } from 'next/server'
import { updateUserRole } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json()
    if (!userId || !['USER', 'VENDOR'].includes(role)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    await updateUserRole(userId, role as UserRole)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to switch role' }, { status: 500 })
  }
} 