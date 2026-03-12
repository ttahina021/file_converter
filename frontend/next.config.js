/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'convifree.com', 'api.convifree.com'],
  },
}

module.exports = nextConfig

