/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Mendaftarkan domain Supabase Storage
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Mendaftarkan Unsplash (jika pakai dummy data)
      },
    ],
  },
};

export default nextConfig;