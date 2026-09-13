import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the sandboxed preview host(s) to use dev resources (HMR, fonts)
  // so the live preview works from the browser proxy.
  allowedDevOrigins: ["*.e2b.app", "127.0.0.1", "localhost"],
  
  // Image optimization for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
