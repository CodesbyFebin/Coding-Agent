import path from 'path';

/** @type {import('next').NextConfig} */
const APP_ORIGIN = 'https://app.codingagent.in';

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd(), '..'),
  experimental: {
    externalDir: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Robots-Tag', value: 'all' },
        ],
      },
    ];
  },
};

export default nextConfig;
