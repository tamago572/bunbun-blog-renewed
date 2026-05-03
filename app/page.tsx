import type { Metadata } from "next";
import { getAllPostsSortedByDate } from "./utils/articleIO";

export default async function Home() {
  // mdファイルが格納されているディレクトリを取得し、slugのみ返す
  const posts = await getAllPostsSortedByDate();
  const _featuredPosts = posts.slice(0, 3); // 最新の3記事をFeaturedとして表示
  const latestPosts = posts.slice(0, 5); // 最新の5記事を表示

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
      <ul>
        {latestPosts.map((post) => (
          <div
            key={post.slug}
            className="mb-4 p-4 bg-gray-200 text-white rounded shadow-md hover:bg-gray-300 hover:scale-102 transition-all"
          >
            <a
              href={`/posts/${post.slug}`}
              className="text-lg font-semibold !text-black"
            >
              {post.title}
            </a>
            <p className="text-sm text-gray-600">
              {post.created_at
                ? post.created_at.toLocaleDateString()
                : "No date"}{" "}
              作成 /{" "}
              {post.updatedDate
                ? post.updatedDate.toLocaleDateString()
                : "No date"}{" "}
              更新
            </p>
          </div>
        ))}
      </ul>

      {/* <h2 className="text-2xl font-bold mb-4">Featured</h2>
      <ul>
        {featuredPosts.map((post) => (
          <div
            key={post.slug}
            className="mb-4 p-4 bg-gray-200 text-white rounded shadow-md hover:bg-gray-300 hover:scale-102 transition-all"
          >
            <a
              href={`/posts/${post.slug}`}
              className="text-lg font-semibold !text-black"
            >
              {post.title}
            </a>
            <p className="text-sm text-gray-600">
              {post.created_at
                ? post.created_at.toLocaleDateString()
                : "No date"}{" "}
              作成 /{" "}
              {post.updatedDate
                ? post.updatedDate.toLocaleDateString()
                : "No date"}{" "}
              更新
            </p>
          </div>
        ))}
      </ul> */}
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ホーム / Bunbun Blog",
    description: "PCやスマホ、プログラミングの技術系ブログを投稿します。",
  };
}
