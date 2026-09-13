import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Skip problematic routes during build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
