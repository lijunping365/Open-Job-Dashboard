/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: true,
  transpilePackages: ['antd', '@ant-design/icons'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.openbytecode.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  output: 'standalone',
};

module.exports = nextConfig;
