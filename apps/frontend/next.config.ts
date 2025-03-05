import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/images/**'
      }
    ]
  },
  experimental: {
    // Only keeping stable experimental features
    typedRoutes: true,
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
