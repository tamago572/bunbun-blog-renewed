import { Noto_Sans_JP } from "next/font/google";
import Header from "../components/Header";
import "@/app/styles/main.css";
import Link from "next/link";
import { getAllPostsSortedByDate, Post } from "../utils/articleIO";

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

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-14 px-4 mt-6">
        <main className="order-1 min-w-0 p-10 rounded-lg shadow-xl bg-white lg:ml-25">
          {children}
        </main>

        <div className="bg-white p-4 min-h-[200px] order-2 rounded-lg shadow-xl">
          {/* サイドバー (右) */}
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
        </div>
      </div>
    </div>
  );
}
