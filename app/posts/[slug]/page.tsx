import matter from "gray-matter";
import type { Metadata } from "next";
import Link from "next/link";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import TwitterShareBtn from "@/app/components/TwitterShareBtn";
import { getAdjacentPosts, getPost, getPostsSlug } from "@/app/utils/articleIO";

const SITE_URL = "https://blog.bunbunapp.dev";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage(props: ArticlePageProps) {
  const { slug } = await props.params;
  const { content, updatedDate, created_at, title, matterData } = await getPost(slug);
  const { previous, next } = await getAdjacentPosts(slug);

  return (
    <>
      <nav className="mb-4">
        <Link href="/">ホーム</Link> &gt; <Link href="/posts">記事一覧</Link> &gt;{" "}
        <span>{title}</span>
      </nav>

      <div className="my-2">
        <TwitterShareBtn
          url={`https://blog.bunbunapp.dev/posts/${slug}`}
          text={`${title} | Bunbun Blog`}
        />
      </div>

      <div className="text-gray-600 text-sm mb-4">
        <span>作成日: {created_at?.toLocaleDateString()}</span>
        <span className="mx-2">/</span>
        <span>最終更新日: {updatedDate?.toLocaleString()}</span>
      </div>

      <MarkdownRenderer content={content} />

      {/* JSON-LD for Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: typeof title === "string" ? title : undefined,
            description: extractDescriptionFromContent(content),
            author: { "@type": "Person", name: "Bunbun" },
            publisher: {
              "@type": "Organization",
              name: "Bunbun Blog",
              logo: { "@type": "ImageObject", url: `${SITE_URL}/bunbun.webp` },
            },
            datePublished: created_at ? created_at.toISOString() : undefined,
            dateModified: updatedDate ? updatedDate.toISOString() : undefined,
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/posts/${slug}` },
          }),
        }}
      />

      <h2 className="text-2xl font-bold my-4">関連記事</h2>
      <p>
        前の記事:{" "}
        {previous ? (
          <Link href={`/posts/${previous.slug}`}>
            {previous.title} - {previous.updatedDate?.toLocaleDateString()}
          </Link>
        ) : (
          "この記事が最古の記事です！"
        )}
      </p>
      <p>
        次の記事:{" "}
        {next ? (
          <Link href={`/posts/${next.slug}`}>
            {next.title} - {next.updatedDate?.toLocaleDateString()}
          </Link>
        ) : (
          "この記事が最新です！"
        )}
      </p>
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

function extractDescriptionFromContent(content: string): string {
  // シンプルに最初の段落を取り、マークダウン記法を削除して短くする
  const withoutHeadings = content.replace(/(^|\n)#+ .*/g, "");
  const paragraphs = withoutHeadings.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const first = paragraphs.length ? paragraphs[0] : "";
  const cleaned = first.replace(/!\[.*?\]\(.*?\)/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/[`*_>~#-]/g, "");
  return cleaned.length > 150 ? `${cleaned.slice(0, 147)}...` : cleaned;
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const { title, content, created_at, updatedDate } = await getPost(slug);

  const description = extractDescriptionFromContent(content) || "Bunbun Blog の記事です。";
  const url = `${SITE_URL}/posts/${slug}`;

  return {
    title: `${title} | Bunbun Blog`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Bunbun Blog`,
      description,
      url,
      siteName: "Bunbun Blog",
      type: "article",
      images: [`${SITE_URL}/bunbun.webp`],
    },
  };
}
