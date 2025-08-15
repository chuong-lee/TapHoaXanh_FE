/** @type {import('next').NextConfig} */
const nextConfig = {
  // Xóa experimental.appDir vì đã được enable mặc định trong Next.js 13+
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
  // Thêm cấu hình images
  images: {
    domains: ["dummyimage.com"],
  },
};

module.exports = nextConfig;
