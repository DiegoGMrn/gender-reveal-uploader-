/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/serve/:path*',
      },
    ];
  },
}

module.exports = nextConfig
