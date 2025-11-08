import Link from "next/link";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import {
  getPostContent,
  getPostsSlug,
  getPostTitle,
  getPostUpdateDate,
  getPreviousPostSlug,
} from "@/app/utils/articleIO";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage(props: ArticlePageProps) {
  const { slug } = await props.params;
  const content = await getPostContent(`${slug}.md`);
  const updatedDate = await getPostUpdateDate(`${slug}.md`);
  const title = await getPostTitle(`${slug}.md`);
  const previousPostSlug = await getPreviousPostSlug(slug);
  const previousPostTitle = await getPostTitle(`${previousPostSlug}.md`);
  


  return (
    <>
      <div className="mb-4">
        <a href="/">ホーム</a> &gt; <Link href="/posts">記事一覧</Link> &gt;{" "}
        <span>{title}</span>
      </div>
      <span>最終更新日: {updatedDate?.toLocaleString()}</span>
      <MarkdownRenderer content={content} />

      <h2 className="text-2xl font-bold my-4">関連記事</h2>
      <p>前の記事: <Link href={`/posts/${previousPostSlug}`}>{previousPostTitle}</Link></p>
      {/* <p>次の記事: <Link href={`/posts/${getNextPostSlug(slug)}`}>次の記事タイトル</Link></p> */}

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
  const title = await getPostTitle(`${slug}.md`);

  return { title: `${title} | Bunbun Blog` };
}
