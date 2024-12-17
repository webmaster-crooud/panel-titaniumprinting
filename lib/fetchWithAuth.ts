export const fetchWithAuth = async (
    token: string | null,
    refreshToken: () => Promise<string | null>,
    url: string,
    options: RequestInit = {},
): Promise<Response> => {
    let currentToken = token;

    // Jika token tidak ada, refresh token
    if (!currentToken) {
        currentToken = await refreshToken();

        if (!currentToken) {
            throw new Error('Unable to obtain token');
        }
    }

    // Tambahkan token ke header Authorization
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${currentToken}`,
    };

    try {
        // Lakukan fetch pertama
        const response = await fetch(url, { ...options, headers });

        // Jika token sudah kedaluwarsa (401 Unauthorized), refresh token dan coba lagi
        if (response.status === 401 || response.status === 403) {
            // Log untuk debugging
            // console.log('Token expired, refreshing...');
            // Refresh token
            currentToken = await refreshToken();

            if (!currentToken) {
                // Redirect ke halaman login jika refresh token gagal
                window.location.href = `${process.env.NEXT_PUBLIC_HOME}/login`;
                throw new Error('Authentication failed');
            }

            // Lakukan fetch ulang dengan token baru
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${currentToken}`,
                },
            });
        }

        return response;
    } catch (error) {
        // Handle network errors atau error lainnya
        console.error('Fetch error:', error);
        throw error;
    }
};
