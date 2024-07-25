// middlewares/with-user-login.ts
import { NextResponse, type NextMiddleware } from 'next/server';
import type { MiddlewareFactory } from './compose-middlewares';
import { getSessionCustomerId } from '~/auth';

/* Checks if the user is authenticated.
If not authenticated, it checks if the current path is in the list of public paths.
Only redirects to the login page if the user is not authenticated AND not on a public path.
*/

export const withUserLogin: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request, event) => {
        const customerId = await getSessionCustomerId();
        const { pathname } = request.nextUrl;

        // List of paths that don't require authentication
        const publicPaths = ['/login'];

        if (!customerId && !publicPaths.some(path => pathname.startsWith(path))) {
            // Redirect to login page if user is not authenticated and not on a public path
            const loginUrl = new URL('/login', request.url);
            //loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
        
        // If user is logged in or on a public path, continue to the next middleware
        return next(request, event);
    }
}