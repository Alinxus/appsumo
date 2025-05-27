export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Go Back Home
      </a>
    </div>
  )
} 