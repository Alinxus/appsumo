import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
      }
    })

    const profile = await db.profile.create({
      data: {
        email,
        fullName,
        role: role || 'USER'
      }
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: { id: user.id, email: user.email, name: user.name },
        profile
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 