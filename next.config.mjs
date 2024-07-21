/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'fastly.picsum.photos',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'static.imoney.my',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
