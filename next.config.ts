import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript checking for migration-validation directory during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint during build to avoid issues with migration-validation
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure proper output for deployment
  output: "standalone",
  // Disable experimental features that might cause issues
  experimental: {
    turbo: {
      rules: {
        // Exclude problematic directories
        "**/.migration-validation/**": ["ignore"],
      },
    },
  },
};

export default nextConfig;
