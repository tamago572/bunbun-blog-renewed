import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsSortedByDate } from "../utils/articleIO";

export default async function PostsPage() {
  // mdファイルが格納されているディレクトリを取得し、slugのみ返す
  const posts = await getAllPostsSortedByDate();

  return (
    <>
      <nav className="mb-4">
        <span>
          <a href="/">ホーム</a> &gt; 記事一覧
        </span>
      </nav>

      <ul className="text-left">
        {posts.map((post) => (
          <li key={post.slug} className="my-2">
            <Link href={`/posts/${post.slug}`}>
              {post.title}
              <span className="text-sm text-gray-500 ml-2">
                (作成:{" "}
                {post.created_at
                  ? post.created_at.toLocaleDateString()
                  : "No date"}{" "}
                / 更新:{" "}
                {post.updatedDate
                  ? post.updatedDate.toLocaleDateString()
                  : "No date"}
                )
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "記事一覧 | Bunbun Blog",
    description: "PCやスマホ、プログラミングの技術系ブログを投稿します。",
  };
}
