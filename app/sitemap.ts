export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { getAllPostsSortedByDate } from "./utils/articleIO";

const SITE_URL = "https://blog.bunbunapp.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPostsSortedByDate();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...allPosts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.updatedDate ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
