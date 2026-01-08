import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: "http://127.0.0.1:5000/v1/:path*",
      },
      {
        source: "/docs",
        destination: "http://127.0.0.1:5000/docs",
      },
      {
        source: "/openapi.json",
        destination: "http://127.0.0.1:5000/openapi.json",
      },
    ];
  },
};

export default nextConfig;
