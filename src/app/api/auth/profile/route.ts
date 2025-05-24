import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, role } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    let profile = await db.profile.findUnique({
      where: { email }
    })

    if (!profile) {
      profile = await db.profile.create({
        data: {
          email,
          fullName: fullName || null,
          role: (role as UserRole) || 'USER'
        }
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
    console.error('Error managing profile:', error)
    return NextResponse.json(
      { error: 'Failed to manage profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const profile = await db.profile.findUnique({
      where: { email }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
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
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
} 