import { requireVendor } from '@/lib/auth'
import { db } from '@/db'
import Link from 'next/link'
import { VendorToolsList } from '@/components/vendor/VendorToolsList'
import { VendorNavigation } from '@/components/vendor/VendorNavigation'

export const dynamic = 'force-dynamic'

export default async function VendorToolsPage() {
  const vendor = await requireVendor()
    if (!vendor) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600">You must be a vendor to access this page.</p>
            <Link href="/auth/register" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                Become a Vendor
            </Link>
            </div>
        </div>
        )
    }
  return (
    <div className="flex flex-col min-h-screen">
      <VendorNavigation user={vendor} />
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
          <VendorToolsList tools={vendor.tools}/>
        </div>
      </main>
    </div>
  )
}