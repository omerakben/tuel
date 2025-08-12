/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: [
    "@tuel/interaction",
    "@tuel/state",
    "@tuel/performance",
    "@tuel/config",
  ],
};

module.exports = nextConfig;
