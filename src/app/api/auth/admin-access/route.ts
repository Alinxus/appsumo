import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function POST(request: NextRequest) {
  try {
    const { email, adminKey } = await request.json()
    
    if (!email || !adminKey) {
      return NextResponse.json(
        { error: 'Email and admin key are required' },
        { status: 400 }
      )
    }

    // Use the environment variable if set, otherwise use a simple fallback key
    const expectedAdminKey = process.env.ADMIN_SECRET_KEY || 'atmet-admin-2024'

    if (adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 401 }
      )
    }

    let profile = await db.profile.findUnique({
      where: { email }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Update the user's role to ADMIN if not already
    if (profile.role !== 'ADMIN') {
      profile = await db.profile.update({
        where: { email },
        data: { role: 'ADMIN' }
      })
    }

    return NextResponse.json({ 
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role
      }
    })
  } catch (error) {
    console.error('Admin access error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 