/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  basePath: '/Gambia-Art-Platform',
  assetPrefix: '/Gambia-Art-Platform/'
}

module.exports = nextConfig;