import type { NextConfig } from "next";

// `npm run dev` keeps its files in .next-dev, separate from the production build in .next,
// so building the site never breaks a dev server that is already running.
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  distDir: isDev ? ".next-dev" : ".next",
  images: {
    // Serve modern formats; Next picks the best one each browser supports.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    qualities: [70, 75, 80],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
