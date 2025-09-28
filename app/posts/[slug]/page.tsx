import fs from "node:fs";

const POST_PATH = "posts/";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage(props: ArticlePageProps) {
  const { slug } = await props.params;
  const content = await fs.promises.readFile(
    `${POST_PATH}/${slug}.md`,
    "utf-8",
  );
  return (
    <>
      <h1>記事ページ: {slug}</h1>
      {/* 記事の内容をここに表示 */}
      <div>{content}</div>
    </>
  );
}

export async function generateStaticParams() {
  // mdファイルが格納されているディレクトリを取得し、slugのみ返す
  const postfiles = await fs.promises.readdir(POST_PATH);

  return postfiles.map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata(props: ArticlePageProps) {
  const { slug } = await props.params;
  const content = await fs.promises.readFile(
    `${POST_PATH}/${slug}.md`,
    "utf-8",
  );
  const title = content.slice(0, content.indexOf("\n"));

  return { title: title };
}
