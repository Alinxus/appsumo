import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

// Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const category = await db.category.findUnique({
      where: { id: params.id }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { name, slug, description, iconUrl, isActive, sortOrder } = data
    
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }
    
    // Check if slug is already taken by another category
    const existingCategory = await db.category.findUnique({
      where: { slug }
    })
    
    if (existingCategory && existingCategory.id !== params.id) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Update the category
    const category = await db.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        iconUrl,
        isActive,
        sortOrder
      }
    })
    
    return NextResponse.json({ 
      message: 'Category updated successfully',
      category 
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: params.id },
      include: { aiTools: { select: { id: true } } }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    
    // Check if category has tools associated with it
    if (category.aiTools.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete a category that has tools associated with it' },
        { status: 400 }
      )
    }
    
    // Delete the category
    await db.category.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ 
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
} 