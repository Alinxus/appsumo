import { db } from '@/db'

export async function verifyAdminKey(adminKey: string): Promise<boolean> {
  const expectedAdminKey = process.env.ADMIN_SECRET_KEY
  return expectedAdminKey !== undefined && adminKey === expectedAdminKey
}

export async function grantAdminAccess(email: string): Promise<boolean> {
  try {
    const profile = await db.profile.findUnique({
      where: { email }
    })

    if (!profile) {
      return false
    }

    if (profile.role === 'ADMIN') {
      return true
    }

    await db.profile.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    return true
  } catch (error) {
    console.error('Error granting admin access:', error)
    return false
  }
}

export async function revokeAdminAccess(email: string): Promise<boolean> {
  try {
    const profile = await db.profile.findUnique({
      where: { email }
    })

    if (!profile || profile.role !== 'ADMIN') {
      return false
    }

    await db.profile.update({
      where: { email },
      data: { role: 'USER' }
    })

    return true
  } catch (error) {
    console.error('Error revoking admin access:', error)
    return false
  }
}

export function getAdminLoginUrl(): string {
  return '/auth/admin'
} 