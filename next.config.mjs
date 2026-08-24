/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'terraeestilo.com.br' }],
        destination: 'https://www.terraeestilo.com.br/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
