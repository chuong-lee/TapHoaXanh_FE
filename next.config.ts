import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["dummyimage.com", "localhost"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        pathname: '/**',
      }
    ],
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
};

export default nextConfig;
