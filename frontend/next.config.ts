import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubActions ? '/kanban' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
