import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { Decoded } from '../hooks/useAuthToken';

export function middleware(request: NextRequest) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return NextResponse.next();
    }

    const token = request.cookies.get('refreshToken')?.value;

    if (!token) {
        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_HOME}/login`, request.url));
    }

    try {
        const decoded: Decoded = jwtDecode(token);

        // Check token expiration with a small buffer
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp <= currentTime) {
            // Clear the invalid cookie
            const response = NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_HOME}/login`, request.url));
            response.cookies.delete('refreshToken');
            return response;
        }

        // Add user info to headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-role', decoded.role);
        requestHeaders.set('x-user-email', decoded.email);

        // Continue with the modified request
        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        return response;
    } catch (error) {
        // Handle invalid tokens by clearing them and redirecting
        const response = NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_HOME}/login`, request.url));
        response.cookies.delete('refreshToken');
        return response;
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|public).*)'],
};
