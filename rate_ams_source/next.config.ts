import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for GitHub Pages deployment
  basePath: '/rate-ams-teacher',
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slash for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
