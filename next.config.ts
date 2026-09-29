import type { NextConfig } from 'next';
const cms = new URL(process.env.STRAPI_URL || 'http://127.0.0.1:1337');
const config: NextConfig = {
  images: { remotePatterns: [{ protocol: cms.protocol.slice(0,-1) as 'http' | 'https', hostname: cms.hostname, port: cms.port, pathname: '/uploads/**' }], dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production' },
};
export default config;
