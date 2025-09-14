import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   async rewrites() {
        return [
          {
            source: '/api/tenant/:path*',
            destination: 'http://localhost:8081/tenant/:path*',
          },
          {
            source: '/api/workflow/:path*',
            destination: 'http://localhost:8082/workflow/:path*',
          },
          {
            source: '/api/authentication/:path*',
            destination: 'http://localhost:8080/authentication/:path*',
          },
        ]
      },
};

export default nextConfig;
