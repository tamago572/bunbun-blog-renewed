import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsSortedByUpdatedDate } from "./utils/articleIO";

export default async function Home() {
  // mdファイルが格納されているディレクトリを取得し、slugのみ返す
  const posts = await getAllPostsSortedByUpdatedDate();
  const _featuredPosts = posts.slice(0, 3); // 最新の3記事をFeaturedとして表示
  const latestPosts = posts.slice(0, 5); // 最新の5記事を表示

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-4">新着記事</h2>
        <div>
          {latestPosts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <div
                key={post.slug}
                className="mb-4 p-4 bg-gray-200 text-white rounded shadow-md hover:bg-gray-300 hover:scale-102 transition-all"
              >
                <span className="text-black text-xl font-bold">{post.title}</span>
                <p className="text-sm text-gray-600">
                  {post.created_at
                    ? post.created_at.toLocaleDateString()
                    : "No date"}{" "}
                  投稿 ・{" "}
                  {post.updatedDate
                    ? post.updatedDate.toLocaleDateString()
                    : "No date"}{" "}
                  更新
                </p>

                <div className="my-2 flex gap-2">
                  {post.matterData.tags && post.matterData.tags.length > 0 ? (
                    post.matterData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-700 text-white px-2 py-1 rounded-2xl"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">開発関連</h2>
        <div>
          {posts.map((post) => post.matterData.tags?.includes("開発") && (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <div
                key={post.slug}
                className="mb-4 p-4 bg-gray-200 text-white rounded shadow-md hover:bg-gray-300 hover:scale-102 transition-all"
                >
                <span className="text-black text-xl font-bold">{post.title}</span>
                <p className="text-sm text-gray-600">
                  {post.created_at
                    ? post.created_at.toLocaleDateString()
                    : "No date"}{" "}
                  作成 ・{" "}
                  {post.updatedDate
                    ? post.updatedDate.toLocaleDateString()
                    : "No date"}{" "}
                  更新
                </p>

                <div className="my-2 flex gap-2">
                  {post.matterData.tags && post.matterData.tags.length > 0 ? (
                    post.matterData.tags.map((tag) => (
                      <span
                      key={tag}
                      className="bg-gray-700 text-white px-2 py-1 rounded-2xl"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">ガジェット関連</h2>
        <div>
          {posts.map((post) => post.matterData.tags?.includes("ガジェット") && (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <div
                key={post.slug}
                className="mb-4 p-4 bg-gray-200 text-white rounded shadow-md hover:bg-gray-300 hover:scale-102 transition-all"
                >
                <span className="text-black text-xl font-bold">{post.title}</span>
                <p className="text-sm text-gray-600">
                  {post.created_at
                    ? post.created_at.toLocaleDateString()
                    : "No date"}{" "}
                  作成 ・{" "}
                  {post.updatedDate
                    ? post.updatedDate.toLocaleDateString()
                    : "No date"}{" "}
                  更新
                </p>

                <div className="my-2 flex gap-2">
                  {post.matterData.tags && post.matterData.tags.length > 0 ? (
                    post.matterData.tags.map((tag) => (
                      <span
                      key={tag}
                      className="bg-gray-700 text-white px-2 py-1 rounded-2xl"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ホーム / Bunbun Blog",
    description: "PCやスマホ、プログラミングの技術系ブログを投稿します。",
  };
}
