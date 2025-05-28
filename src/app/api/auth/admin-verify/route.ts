import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { adminKey } = await request.json()
    
    if (!adminKey) {
      return NextResponse.json(
        { error: 'Admin key is required' },
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

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin key verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 