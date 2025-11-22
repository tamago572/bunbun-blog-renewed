import { Noto_Sans_JP } from "next/font/google";
import Header from "../components/Header";
import "@/app/styles/main.css";
import Link from "next/link";
import { getAllPostsSortedByDate, type Post } from "../utils/articleIO";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recentPosts: Post[] = [
    ...await getAllPostsSortedByDate(),
  ]
  return (
    <div className={`${notoSansJP.className}`}>
      <Header />

      <div className="flex justify-center lg:px-4 lg:mt-6">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_700px_300px] gap-8">
          {/* 左余白（デスクトップのみ表示） */}
          <div className="hidden lg:block"></div>

          {/* メインコンテンツ（中央固定） */}
          <main className="min-w-0 p-10 rounded-lg shadow-xl bg-white">
            {children}
          </main>

          {/* サイドバー（右） */}
          <aside className="bg-white p-4 min-h-[200px] rounded-lg shadow-xl">
            <section className="mt-4 mb-8">
              <h2>最近の記事</h2>
              <ul>
                {recentPosts.slice(0, 5).map((post) => (
                  <li key={post.slug}>
                    <Link href={`/posts/${post.slug}`}>
                      <div className="bg-stone-800 text-white p-2 my-2 rounded shadow hover:bg-gray-700 hover:scale-102 transition-all">
                        {post.title}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="my-8">
              <h2>プロフィール</h2>
              <p>Bunbun Blogの管理人、Bunbunです。プログラミングやガジェットに関する情報を発信しています。</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
