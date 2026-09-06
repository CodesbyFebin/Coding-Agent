import path from 'path';

/** @type {import('next').NextConfig} */
const APP_ORIGIN = 'https://app.codingagent.in';

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd(), '..'),
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      // Authenticated application routes live on the app origin.
      { source: '/login', destination: APP_ORIGIN + '/login', permanent: false },
      { source: '/register', destination: APP_ORIGIN + '/register', permanent: false },
      { source: '/projects/:path*', destination: APP_ORIGIN + '/projects/:path*', permanent: false },
      { source: '/missions', destination: APP_ORIGIN + '/projects', permanent: false },
      { source: '/analytics', destination: APP_ORIGIN + '/analytics', permanent: false },
      { source: '/code', destination: APP_ORIGIN + '/code', permanent: false },
      { source: '/terminal', destination: APP_ORIGIN + '/terminal', permanent: false },
      { source: '/browser', destination: APP_ORIGIN + '/browser', permanent: false },
      { source: '/memory', destination: APP_ORIGIN + '/memory', permanent: false },
      { source: '/skills', destination: APP_ORIGIN + '/skills', permanent: false },
      { source: '/mcp', destination: '/model-context-protocol', permanent: true },
      { source: '/schedules', destination: APP_ORIGIN + '/schedules', permanent: false },
      { source: '/security', destination: '/security-matrix', permanent: false },
      { source: '/settings', destination: APP_ORIGIN + '/settings', permanent: false },
      { source: '/workspaces', destination: APP_ORIGIN + '/projects', permanent: false },
      { source: '/about', destination: '/platform', permanent: true },
      { source: '/learn', destination: '/pillars', permanent: true },
      { source: '/compare', destination: '/pillars', permanent: true },
      { source: '/research', destination: '/platform', permanent: true },
      { source: '/sovereign-ai', destination: '/india-sovereign-ai', permanent: true },
      { source: '/glossary', destination: '/pillars', permanent: true },
      { source: '/status', destination: '/', permanent: true },
    ];
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
