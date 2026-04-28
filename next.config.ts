import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/blog/**": ["./content/blog/**/*.mdx"],
    "/sitemap.xml": ["./content/blog/**/*.mdx"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/franklin-run-assets/**",
      },
      {
        protocol: "https",
        hostname: "cdn.franklin.run",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
