/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Removed exportPathMap and trailingSlash configuration
};

module.exports = nextConfig;