<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["dummyimage.com"],
    formats: ['image/webp', 'image/avif'],
  },
  
  // PWA Configuration
  experimental: {
    serverComponents: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  
  // Enable compression
  compress: true,
  
  // Optimize build
  swcMinify: true,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
};

module.exports = nextConfig;
=======
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'app'),
      '@/components': require('path').resolve(__dirname, 'app/components'),
      '@/lib': require('path').resolve(__dirname, 'lib'),
    };
    return config;
  },
  // Thêm cấu hình để đảm bảo alias hoạt động
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
>>>>>>> new-branch-name
