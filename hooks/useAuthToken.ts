import { useCallback, useEffect, useState } from 'react';
import { AUTH } from '../lib/utils';
import { jwtDecode } from 'jwt-decode';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { authAccount } from '../store/Atom';

// Define comprehensive interfaces for better type safety
export interface Decoded {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    username: string;
    exp: number;
}

interface TokenResponse {
    token: string;
    message?: string;
}

interface AuthState {
    token: string;
    expired: number | null;
    isLoading: boolean;
    error: string | null;
}

export const useAuthToken = () => {
    // Enhanced state management with loading and error states
    const [authState, setAuthState] = useState<AuthState>({
        token: '',
        expired: null,
        isLoading: true,
        error: null,
    });
    const setAccount = useSetAtom(authAccount);
    const router = useRouter();

    // Helper function to check if a token is about to expire
    const isTokenExpiringSoon = useCallback((exp: number) => {
        // Check if token will expire in the next 5 minutes
        const fiveMinutes = 5 * 60;
        return exp - Date.now() / 1000 < fiveMinutes;
    }, []);

    // Enhanced decode function with better error handling
    const decodeAndSetAccount = useCallback(
        (jwt: string) => {
            try {
                // Verify the token is in correct JWT format
                if (!jwt.startsWith('ey')) {
                    throw new Error('Invalid token format');
                }

                const decoded: Decoded = jwtDecode(jwt);

                // Validate decoded data
                if (!decoded.email || !decoded.role) {
                    throw new Error('Invalid token payload');
                }

                // Check if token is already expired
                if (decoded.exp && decoded.exp < Date.now() / 1000) {
                    throw new Error('Token is expired');
                }

                // Update account state
                setAccount({
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    role: decoded.role,
                    username: decoded.username,
                });

                // Update auth state
                setAuthState((prev) => ({
                    ...prev,
                    token: jwt,
                    expired: decoded.exp,
                    error: null,
                    isLoading: false,
                }));
            } catch (error) {
                console.error('Token decode error:', error);
                setAuthState((prev) => ({
                    ...prev,
                    error: 'Invalid authentication token',
                    isLoading: false,
                }));
                router.push(`${process.env.NEXT_PUBLIC_HOME}/login`);
            }
        },
        [setAccount, router],
    );

    // Enhanced refresh token function with retry logic
    const refreshToken = useCallback(
        async (retryCount = 3) => {
            const attemptRefresh = async (attempt: number): Promise<string | null> => {
                try {
                    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

                    const response = await fetch(`${AUTH}/token`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Cache-Control': 'no-cache',
                            Pragma: 'no-cache',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result: TokenResponse = await response.json();

                    if (!result.token) {
                        throw new Error('No token in response');
                    }

                    decodeAndSetAccount(result.token);
                    return result.token;
                } catch (error) {
                    console.error(`Refresh attempt ${attempt} failed:`, error);

                    if (attempt < retryCount) {
                        // Exponential backoff delay
                        const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
                        await new Promise((resolve) => setTimeout(resolve, delay));
                        return attemptRefresh(attempt + 1);
                    }

                    setAuthState((prev) => ({
                        ...prev,
                        error: 'Failed to refresh authentication',
                        isLoading: false,
                    }));
                    router.push(`${process.env.NEXT_PUBLIC_HOME}/login`);
                    return null;
                }
            };

            return attemptRefresh(1);
        },
        [decodeAndSetAccount, router],
    );

    // Enhanced initialization effect
    useEffect(() => {
        let refreshInterval: NodeJS.Timeout;

        const initializeAuth = async () => {
            if (!authState.token) {
                await refreshToken();
            }
        };

        const setupRefreshInterval = () => {
            if (authState.expired) {
                // Calculate time until token needs refresh
                const timeUntilRefresh = (authState.expired - 300) * 1000 - Date.now();

                if (timeUntilRefresh > 0) {
                    refreshInterval = setTimeout(() => {
                        refreshToken();
                    }, timeUntilRefresh);
                } else {
                    // Token is expired or about to expire, refresh immediately
                    refreshToken();
                }
            }
        };

        initializeAuth();
        setupRefreshInterval();

        // Cleanup interval on unmount
        return () => {
            if (refreshInterval) {
                clearTimeout(refreshInterval);
            }
        };
    }, [authState.token, authState.expired, refreshToken]);

    return {
        token: authState.token,
        refreshToken,
        expired: authState.expired,
        isLoading: authState.isLoading,
        error: authState.error,
    };
};
