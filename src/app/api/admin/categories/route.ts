import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

// Get all categories
export async function GET(request: NextRequest) {
  try {
    // Import auth only when needed to avoid build-time issues
    const { requireAdmin } = await import('@/lib/auth')
    
    try {
      await requireAdmin()
    } catch (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const categories = await db.category.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// Create new category
export async function POST(request: NextRequest) {
  try {
    // Import auth only when needed to avoid build-time issues
    const { requireAdmin } = await import('@/lib/auth')
    
    try {
      await requireAdmin()
    } catch (authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const data = await request.json()
    const { name, slug, description, iconUrl, isActive = true, sortOrder = 0 } = data
    
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }
    
    // Check if slug is already taken
    const existingCategory = await db.category.findUnique({
      where: { slug }
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Create the category
    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        iconUrl,
        isActive,
        sortOrder
      }
    })
    
    return NextResponse.json(
      { 
        message: 'Category created successfully',
        category 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 