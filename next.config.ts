import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // SSGの設定
  output: "export",
  // SSGではnext/Imageが使えないので無効化
  images: {
    unoptimized: true,
  },
  // posts/[slug].htmlではなくposts/[slug]/index.htmlで出力する SEO的に有利(多分)
  trailingSlash: true,
  distDir: "docs",
};

export default nextConfig;
