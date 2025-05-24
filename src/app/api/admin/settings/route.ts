import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/db'

export async function PUT(request: NextRequest) {
  try {
    // Check auth only if we're in a request context
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