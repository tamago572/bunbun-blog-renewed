import {
  getPostContent,
  getPostsSlug,
  getPostTitle,
  getPostUpdateDate,
} from "@/app/utils/articleIO";
import "@/app/styles/main.css";
import { Noto_Sans_JP } from "next/font/google";
import Header from "@/app/components/header";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage(props: ArticlePageProps) {
  const { slug } = await props.params;
  const content = await getPostContent(`${slug}.md`);
  const updatedDate = await getPostUpdateDate(`${slug}.md`);

  return (
    <div className={`${notoSansJP.className}`}>
      <Header />

      <div className="p-8">
        <span>最終更新日: {updatedDate?.toLocaleString()}</span>
        <MarkdownRenderer content={content} />
      </div>
    </div>
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

  return { title: title };
}
