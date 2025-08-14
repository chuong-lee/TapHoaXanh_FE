import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
  images: {
    domains: ["dummyimage.com"], // 👈 thêm domain ở đây
  },
};

export default nextConfig;
