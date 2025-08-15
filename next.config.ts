import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["dummyimage.com"],
  },
  // Thêm cấu hình webpack để tránh xung đột với Turbopack
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
