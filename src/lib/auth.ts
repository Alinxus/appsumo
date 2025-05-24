import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'

// Check if we're in build context
function isBuildTime() {
  return typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL
}

export async function getCurrentUser() {
  // Skip auth during build time
  if (isBuildTime()) {
    return null
  }

  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    const profile = await db.profile.findUnique({
      where: { email: user.email! }
    })

    return {
      id: user.id,
      email: user.email!,
      profile
    }
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  // Skip auth during build time
  if (isBuildTime()) {
    throw new Error('Auth not available during build')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth()
  
  if (user.profile?.role !== role) {
    redirect('/unauthorized')
  }
  
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (!user.profile || user.profile.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  return user
}

export async function requireVendor() {
  const user = await requireAuth()
  
  if (!user.profile || (user.profile.role !== 'VENDOR' && user.profile.role !== 'ADMIN')) {
    redirect('/dashboard')
  }
  
  return user
}

export async function isAdmin() {
  // Skip auth during build time
  if (isBuildTime()) {
    return false
  }

  const user = await getCurrentUser()
  return user?.profile?.role === 'ADMIN'
}

export async function isVendor() {
  // Skip auth during build time
  if (isBuildTime()) {
    return false
  }

  const user = await getCurrentUser()
  return user?.profile?.role === 'VENDOR' || user?.profile?.role === 'ADMIN'
}

export async function createProfile(email: string, fullName?: string, role: 'USER' | 'VENDOR' | 'ADMIN' = 'USER') {
  const existingProfile = await db.profile.findUnique({
    where: { email }
  })

  if (existingProfile) {
    return existingProfile
  }

  return await db.profile.create({
    data: {
      email,
      fullName: fullName || null,
      role
    }
  })
}

export async function updateUserRole(userId: string, role: UserRole) {
  return await db.profile.update({
    where: { id: userId },
    data: { role },
  })
} 