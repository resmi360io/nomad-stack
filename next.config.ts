import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
    return [
      { source: "/ingest/static/:path*", destination: `${host}/static/:path*` },
      { source: "/ingest/:path*", destination: `${host}/:path*` },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
