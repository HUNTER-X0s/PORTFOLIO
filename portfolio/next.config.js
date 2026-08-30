/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'opengraph.githubassets.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'clsx',
      'tailwind-merge',
    ],
  },
  async headers() {
    return [
      // ── API routes: never index
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },

      // ── Static assets: long-lived cache (immutable)
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|mp3|wav|ogg|woff|woff2|ttf|otf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },

      // ── All routes: security + SEO signals
      {
        source: '/:path*',
        headers: [
          // DNS pre-fetch (speed signal for Googlebot)
          { key: 'X-DNS-Prefetch-Control', value: 'on' },

          // Referrer — lets GA/analytics see full referrer for SEO tracking
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // MIME sniffing protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Clickjacking protection (also allows embedding on your own domain)
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

          // HSTS — tells browsers to always use HTTPS (helps Google trust score)
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

          // Permissions policy — don't leak sensors data
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()',
          },

          // XSS Protection (legacy browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },

          // Cross-Origin policies
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },

      // ── Sitemap & robots: short cache so updates propagate fast
      {
        source: '/(sitemap.xml|robots.txt|manifest.webmanifest)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // 301 redirect from old domain for SEO authority transfer
      // If this project is ever deployed to the old URL again, redirect everything
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'anurag07.vercel.app',
          },
        ],
        destination: 'https://anuragswain.vercel.app/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
