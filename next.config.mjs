/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https', // atau 'https' sesuai protocol backend Anda
                hostname: 'api.titaniumprint.id', // sesuaikan dengan hostname backend Anda
                pathname: '/public/**', // mengizinkan akses ke semua file di folder public
            },
            // Jika Anda juga perlu akses ke assets.example.com
            {
                protocol: 'https',
                hostname: 'assets.example.com',
            },
        ],
    },
};

export default nextConfig;
