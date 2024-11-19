/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http', // atau 'https' sesuai protocol backend Anda
                hostname: '127.0.0.1', // sesuaikan dengan hostname backend Anda
                port: '3001', // sesuaikan dengan port backend Anda
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
