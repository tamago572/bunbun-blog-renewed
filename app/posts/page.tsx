import Link from "next/link";
import { getPostsSlug, getPostsTitle, getPostsUpdateDates, getPostUpdateDate } from "../utils/articleIO";

export default async function PostsPage() {
      // mdファイルが格納されているディレクトリを取得し、slugのみ返す
      const postsTitle = await getPostsTitle();
      const postsSlug = await getPostsSlug();
  const postsUpdateDates = await getPostsUpdateDates();


    return (
    <>
        <div className="mb-4">
          <span><a href="/">ホーム</a> &gt; 記事一覧</span>
        </div>


        <ul className="text-left">
        {postsTitle.map((title, index) => (
            <li key={title}>
            <Link href={`/posts/${postsSlug[index]}`}>
                {title} -{" "}
                {postsUpdateDates[index]
                ? (postsUpdateDates[index] as Date).toLocaleDateString()
                : "No date"}
            </Link>
            </li>
        ))}
        </ul>
    </>
    )
}
