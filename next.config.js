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
