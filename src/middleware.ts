// middleware.ts di root project
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
    // Ambil token dari cookies
    const token = request.cookies.get('refreshToken')?.value;

    // Jika tidak ada token, redirect ke login
    if (!token) {
        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_HOME}/login`, request.url));
    }

    // Verifikasi token (tambahkan logika verifikasi jwt di sini)
    try {
        // Contoh verifikasi sederhana (Anda perlu implementasi yang lebih kompleks)

        const decoded = jwtDecode(token);

        // Cek apakah token sudah expired
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_HOME}/login`, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // Token tidak valid
        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_HOME}/login`, request.url));
    }
}

// Konfigurasi matcher untuk middleware
export const config = {
    matcher: [
        // Semua route yang ingin di-protect
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
