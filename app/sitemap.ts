export const dynamic = "force-static";

import { MetadataRoute } from "next";
import { getPostsSlug, getPostsUpdateDates } from "./utils/articleIO";

const SITE_URL = "https://blog-renewed.web.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsSlug = await getPostsSlug();
  const postsUpdateDates = await getPostsUpdateDates();

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
    ...postsSlug.map((slug, index) => ({
      url: `${SITE_URL}/posts/${slug}`,
      lastModified: postsUpdateDates[index]
        ? (postsUpdateDates[index] as Date)
        : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
