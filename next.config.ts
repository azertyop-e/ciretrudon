import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    // @import "tailwindcss" est traité par PostCSS, pas par Sass — on silence cette dépréciation
    silenceDeprecations: ["import"],
  },
};

export default nextConfig;
