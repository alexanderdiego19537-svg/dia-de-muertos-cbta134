import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Quita el badge/indicador de Next.js en la esquina
  devIndicators: false,
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
