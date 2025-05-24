import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const existingSubscription = await db.newsletterSubscription.findUnique({
      where: { email }
    })

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json({ 
          message: 'You are already subscribed to our newsletter!' 
        })
      } else {
        await db.newsletterSubscription.update({
          where: { email },
          data: { isActive: true }
        })
      }
    } else {
      await db.newsletterSubscription.create({
        data: { email }
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter!'
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
} 