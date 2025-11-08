/**
 * 新しい getPost() 関数を使った実装例
 *
 * このファイルは、既存の app/posts/[slug]/page.tsx を
 * 新しい統一されたデータ構造を使うように書き換えたサンプルです。
 */

import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import Header from "@/app/components/Header";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import { getPost, getPostsSlug, getPreviousPostSlug } from "@/app/utils/articleIO";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

/**
 * 記事ページコンポーネント（新実装版）
 *
 * 変更点:
 * - getPostContent, getPostTitle, getPostUpdateDate の3つの関数呼び出しを
 *   getPost 1つに統合
 * - コードが簡潔になり、可読性が向上
 * - ファイル読み込みが1回で済むため、パフォーマンスが向上
 */
export default async function ArticlePage(props: ArticlePageProps) {
  const { slug } = props.params;

  // 🎯 新実装: 1回の呼び出しで全情報を取得
  const post = await getPost(slug);

  // 前の記事のスラッグを取得（改善されたロジックを使用）
  const previousPostSlug = await getPreviousPostSlug(slug);
  let previousPost = null;
  if (previousPostSlug) {
    previousPost = await getPost(previousPostSlug);
  }

  return (
    <div className={`${notoSansJP.className}`}>
      <Header />

      <div className="p-8">
        {/* パンくずリスト */}
        <nav className="text-sm mb-4">
          <Link href="/">ホーム</Link> &gt; <Link href="/posts">記事一覧</Link> &gt;{" "}
          <span>{post.title}</span>
        </nav>

        {/* 前の記事へのリンク */}
        {previousPost && (
          <p className="mb-2">
            前の記事:{" "}
            <Link href={`/posts/${previousPost.slug}`}>{previousPost.title}</Link>
          </p>
        )}

        {/* 更新日 */}
        <p className="text-xs text-gray-500 mb-4">
          更新日: {post.updatedDate?.toLocaleString()}
        </p>

        {/* 記事本文 */}
        <MarkdownRenderer content={post.content} />
      </div>
    </div>
  );
}

/**
 * 静的パスの生成
 * この部分は変更なし
 */
export async function generateStaticParams() {
  const slugs = await getPostsSlug();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

/**
 * メタデータの生成（新実装版）
 *
 * 変更点:
 * - getPostTitle の代わりに getPost を使用
 * - 同じ記事データを再利用可能（将来的にはキャッシュ戦略を追加可能）
 */
export async function generateMetadata(props: ArticlePageProps) {
  const { slug } = props.params;

  // 🎯 新実装: Post型で取得
  const post = await getPost(slug);

  return {
    title: post.title,
    // 将来的には description なども追加可能
    // description: post.content.slice(0, 160),
  };
}
