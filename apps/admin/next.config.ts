import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: "3001",
    CHIP_BRAND_ID: process.env.CHIP_BRAND_ID!,
    CHIP_LIVE_KEY: process.env.CHIP_LIVE_KEY!
  },
  async headers() {
    return [
      {
        // Required for Chip webhook handling
        source: '/api/webhooks/chip',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  }
};

export default nextConfig;
