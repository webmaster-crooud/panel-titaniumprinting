import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface Decoded {
    exp?: number;
    role?: string;
    email?: string;
}

export function middleware(request: NextRequest) {
    if (request.method === 'OPTIONS') {
        return NextResponse.next();
    }

    try {
        const tokenCookie = request.cookies.get('refreshToken');

        if (!tokenCookie || typeof tokenCookie.value !== 'string') {
            throw new Error('No valid token found');
        }

        if (!tokenCookie.value.startsWith('ey')) {
            throw new Error('Invalid token format');
        }

        const token: string = tokenCookie.value;

        try {
            const decoded = jwtDecode<Decoded>(token);

            if (!decoded || typeof decoded !== 'object') {
                throw new Error('Invalid token structure');
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp <= currentTime) {
                throw new Error('Token expired');
            }

            const requestHeaders = new Headers(request.headers);
            if (decoded.role) requestHeaders.set('x-user-role', decoded.role);
            if (decoded.email) requestHeaders.set('x-user-email', decoded.email);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch (decodeError) {
            console.error('Token decode error:', decodeError);
            throw new Error('Failed to decode token');
        }
    } catch (error) {
        // Create the response first
        const response = NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_HOME}/login`, request.url));

        // Delete the cookie using the type-safe approach
        // Method 1: Using just the name
        response.cookies.delete('refreshToken');

        // Method 2: If you need to specify options, set an empty cookie with immediate expiration
        response.cookies.set('refreshToken', '', {
            path: '/',
            domain: '.titaniumprint.id',
            secure: true,
            httpOnly: true,
            maxAge: 0, // This makes the cookie expire immediately
            sameSite: 'lax',
        });

        return response;
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|public).*)'],
};
