import type { NextConfig } from 'next';
import { SASS_BREAKPOINTS } from './src/config/breakpoints';
const cms = new URL(process.env.STRAPI_URL || 'http://127.0.0.1:1337');
const config: NextConfig = {
  sassOptions: {
    additionalData: SASS_BREAKPOINTS,
  },
  images: {
    remotePatterns: [
      {
        protocol: cms.protocol.slice(0, -1) as 'http' | 'https',
        hostname: cms.hostname,
        port: cms.port,
        pathname: '/uploads/**',
      },
    ],
    dangerouslyAllowLocalIP: ['127.0.0.1', 'localhost', '[::1]'].includes(cms.hostname),
  },
};
export default config;
