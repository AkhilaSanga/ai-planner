/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
    ignoreBuildErrors: false,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack config
    config.optimization = {
      ...config.optimization,
      minimize: !dev,
    };

    return config;
  },
  // Performance optimizations
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  generateEtags: true,
  // API route optimizations
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  // Image optimization
  images: {
    unoptimized: true,
  },
  // Build optimization
  experimental: {
    // Disable some experimental features for stability
  },
};

module.exports = nextConfig;
