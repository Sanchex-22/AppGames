/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica para exportación estática
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // Configuración para TypeScript y ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuración para desarrollo
  reactStrictMode: true,
  // swcMinify: true,
}

module.exports = nextConfig
