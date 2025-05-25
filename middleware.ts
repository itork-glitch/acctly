// middleware.ts (create this in your root directory - optional but recommended)
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/account/:path*', '/dashboard/:path*'], // Add other protected routes here
};
