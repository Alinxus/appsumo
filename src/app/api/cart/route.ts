import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/db'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get cart items from session/localStorage or database
    const cartItems = [] // This will be handled by frontend state
    
    return NextResponse.json({
      success: true,
      data: { items: cartItems }
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items } = await request.json()
    
    // Process cart items for checkout
    const processedItems = []
    let totalAmount = 0

    for (const item of items) {
      if (item.type === 'tool') {
        const tool = await db.aiTool.findUnique({
          where: { id: item.id },
          include: { category: true, vendor: true }
        })
        
        if (tool && tool.status === 'ACTIVE') {
          const price = tool.dealPrice || tool.regularPrice
          totalAmount += Number(price) * item.quantity
          processedItems.push({
            ...item,
            name: tool.name,
            price: Number(price),
            image: tool.images[0] || null,
            vendor: tool.vendor.fullName
          })
        }
      } else if (item.type === 'course') {
        const course = await db.course.findUnique({
          where: { id: item.id },
          include: { category: true, vendor: true }
        })
        
        if (course && course.status === 'ACTIVE') {
          const price = course.dealPrice || course.regularPrice
          totalAmount += Number(price) * item.quantity
          processedItems.push({
            ...item,
            name: course.name,
            price: Number(price),
            image: course.images[0] || null,
            vendor: course.vendor.fullName
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        items: processedItems,
        totalAmount,
        itemCount: processedItems.length
      }
    })
  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
