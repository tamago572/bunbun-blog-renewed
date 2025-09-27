interface ArticlePageProps {
  params: {
    slug: string;
    content?: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <>
      <h1>記事ページ: {params.slug}</h1>
      {/* 記事の内容をここに表示 */}
    </>
  );
}

export async function generateStaticParams() {
  const postfiles: string[] = [
    "example-article",
    "test-article",
    "sample-article",
  ];
  // TODO: mdファイルが格納されているディレクトリを、lsコマンド的処理で取得、一つづつreadFileSyncで読み込み、slugとcontentを返す

  return postfiles.map((slug) => ({
    slug: slug,
    content: "<記事の内容>",
  }));
}
