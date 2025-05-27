import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        if (pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        
        if (pathname.startsWith('/vendor')) {
          return token?.role === 'VENDOR' || token?.role === 'ADMIN'
        }
        
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/vendor/:path*',
    '/api/admin/:path*',
    '/api/vendor/:path*'
  ],
}
