import Link from "next/link";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import {
  getAdjacentPosts,
  getPost,
  getPostsSlug,
} from "@/app/utils/articleIO";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage(props: ArticlePageProps) {
  const { slug } = await props.params;
  const { content, updatedDate, title } = await getPost(slug);
  const { previous, next } = await getAdjacentPosts(slug);

  return (
    <>
      <div className="mb-4">
        <a href="/">ホーム</a> &gt; <Link href="/posts">記事一覧</Link> &gt;{" "}
        <span>{title}</span>
      </div>
      <span>最終更新日: {updatedDate?.toLocaleString()}</span>
      <MarkdownRenderer content={content} />

      <h2 className="text-2xl font-bold my-4">関連記事</h2>
      <p>前の記事: {previous ? <Link href={`/posts/${previous.slug}`}>{previous.title} - {previous.updatedDate?.toLocaleDateString()}</Link> : "記事がありません"}</p>
      <p>次の記事: {next ? <Link href={`/posts/${next.slug}`}>{next.title} - {next.updatedDate?.toLocaleDateString()}</Link> : "記事がありません"}</p>

    </>
  );
}

export async function generateStaticParams() {
  // mdファイルが格納されているディレクトリを取得し、slugのみ返す
  const slugs = await getPostsSlug();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata(props: ArticlePageProps) {
  const { slug } = await props.params;
  const { title } = await getPost(slug);

  return { title: `${title} | Bunbun Blog` };
}
