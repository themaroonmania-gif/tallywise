import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    // Next's default s-maxage for prerendered pages is effectively "forever"
    // (no `revalidate` export = treated as immutable), which Cloudflare's edge
    // then honors literally — a deploy can ship a fix and users/edge nodes
    // keep serving the old HTML for up to a year until that entry's TTL
    // naturally expires or someone manually purges cache. Cap it short so
    // deploys actually reach users within minutes instead of requiring a
    // manual cache purge every time.
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

