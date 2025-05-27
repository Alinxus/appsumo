import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function PUT(request: NextRequest) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
      return NextResponse.json(
        { error: 'API not available during build' },
        { status: 503 }
      )
    }

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
    
    const settings = await db.adminSettings.upsert({
      where: { id: 'default' },
      update: {
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        siteUrl: data.siteUrl,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        primaryColor: data.primaryColor,
        accentColor: data.accentColor,
        enableNewsletter: data.enableNewsletter,
        enableUserRegistration: data.enableUserRegistration,
        maintenanceMode: data.maintenanceMode,
        maintenanceMessage: data.maintenanceMessage,
      },
      create: {
        id: 'default',
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        siteUrl: data.siteUrl,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        primaryColor: data.primaryColor,
        accentColor: data.accentColor,
        enableNewsletter: data.enableNewsletter,
        enableUserRegistration: data.enableUserRegistration,
        maintenanceMode: data.maintenanceMode,
        maintenanceMessage: data.maintenanceMessage,
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Error updating admin settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
} 