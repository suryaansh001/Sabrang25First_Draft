// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/qrcode/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  reactStrictMode: true,
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      'react-icons',
      '@tabler/icons-react'
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Advanced bundle optimization
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      // Advanced code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 100000,
        cacheGroups: {
          // Framework libraries
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
          },
          // Animation libraries
          animations: {
            test: /[\\/]node_modules[\\/](framer-motion|gsap)[\\/]/,
            name: 'animations',
            chunks: 'all',
            priority: 30,
          },
          // Icon libraries
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|react-icons|@tabler\/icons-react)[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 25,
          },
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](clsx|tailwind-merge)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 20,
          },
          // Other vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Common shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
        },
      };
      
      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    // Optimize imports and aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@components': './components',
      '@public': './public',
    };
    
    // Optimize module resolution
    config.resolve.modules = ['node_modules'];
    
    return config;
  },
};

export default nextConfig;