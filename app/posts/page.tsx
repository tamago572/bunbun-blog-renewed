import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllPostsSortedByDate
} from "../utils/articleIO";

export default async function PostsPage() {
  // mdファイルが格納されているディレクトリを取得し、slugのみ返す
  const posts = await getAllPostsSortedByDate();

  return (
    <>
      <div className="mb-4">
        <span>
          <a href="/">ホーム</a> &gt; 記事一覧
        </span>
      </div>

      <ul className="text-left">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              {post.title} -{" "}
              {post.updatedDate
                ? (post.updatedDate as Date).toLocaleDateString()
                : "No date"}
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
