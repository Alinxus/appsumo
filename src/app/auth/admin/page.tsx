import { Metadata } from 'next'
import { AdminLoginForm } from '@/components/auth/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Admin access only',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Restricted area - Admin authorization required
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
} 