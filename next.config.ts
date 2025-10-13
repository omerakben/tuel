import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict TypeScript checking for production quality
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable ESLint checking for production quality
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Try trailingSlash to help with routing
  trailingSlash: true,
  // Disable image optimization for simpler deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
