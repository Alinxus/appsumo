import { getCurrentUser } from '@/lib/auth'
import { AdminHeaderClient } from './AdminHeaderClient'

export async function AdminHeader() {
  const user = await getCurrentUser()

  return <AdminHeaderClient user={user} />
} 