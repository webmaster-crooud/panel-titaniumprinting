import { useCallback, useEffect, useState } from 'react';
import { AUTH } from '../lib/utils';
import { jwtDecode } from 'jwt-decode';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { authAccount } from '../store/Atom';
interface Decoded {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    username: string;
    exp: number;
}
export const useAuthToken = () => {
    const [token, setToken] = useState<string>('');
    const [expired, setExpired] = useState<number | null>(null);
    const setAccount = useSetAtom(authAccount);
    const router = useRouter();

    // Fungsi untuk decode dan set account
    const decodeAndSetAccount = useCallback(
        (jwt: string) => {
            try {
                const decoded: Decoded = jwtDecode(jwt);
                setAccount({
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    role: decoded.role,
                    username: decoded.username,
                });
                setExpired(decoded.exp);
                setToken(jwt); // Simpan token baru
            } catch (error) {
                console.error('Failed to decode token', error);
                // Redirect ke login jika decode gagal
                router.push(`${process.env.NEXT_PUBLIC_HOME}/login`);
            }
        },
        [setAccount, router],
    );

    // Fungsi refresh token yang lebih komprehensif
    const refreshToken = useCallback(async () => {
        try {
            const response = await fetch(`${AUTH}/token`, {
                method: 'GET',
                credentials: 'include',
            });

            // Pastikan response berhasil
            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const result = await response.json();

            // Periksa apakah ada token baru
            if (!result.token) {
                // Redirect ke login jika tidak ada token
                router.push(`${process.env.NEXT_PUBLIC_HOME}/login`);
                return null;
            }

            // Decode dan set token baru
            decodeAndSetAccount(result.token);

            return result.token;
        } catch (error) {
            console.error('Token refresh error:', error);
            // Redirect ke halaman login jika refresh gagal
            router.push(`${process.env.NEXT_PUBLIC_HOME}/login`);
            return null;
        }
    }, [decodeAndSetAccount, router]);

    // Inisialisasi token
    useEffect(() => {
        const initToken = async () => {
            if (!token) {
                await refreshToken();
            }
        };
        initToken();
    }, [token, refreshToken]);

    return { token, refreshToken, expired };
};
