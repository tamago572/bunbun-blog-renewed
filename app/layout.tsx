import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { Noto_Sans_JP } from "next/font/google";
import Header from "./components/Header";
import "@/app/styles/main.css";
import Image from "next/image";
import Link from "next/link";
import {
  FaSquareBluesky,
  FaSquareGithub,
  FaSquareTwitter,
  FaYoutube,
} from "react-icons/fa6";
import FirebaseInit from "./components/FirebaseInit";
import { getAllPostsSortedByDate, type Post } from "./utils/articleIO";

export const metadata: Metadata = {
  title: "Bunbun Blog",
  description: "PCやスマホ、プログラミングの技術系ブログを投稿します。",
  alternates: {
    canonical: "https://blog.bunbunapp.dev",
  },
  openGraph: {
    title: "Bunbun Blog",
    description: "PCやスマホ、プログラミングの技術系ブログを投稿します。",
    url: "https://blog.bunbunapp.dev",
    siteName: "Bunbun Blog",
    images: ["https://blog.bunbunapp.dev/bunbun.webp"],
    locale: "ja_JP",
  },
};

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recentPosts: Post[] = [...(await getAllPostsSortedByDate())];

  const repoUrl = "https://github.com/tamago572/bunbun-blog-renewed";
  const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH || "unknown";

  return (
    <html lang="ja">
      <body>
        <FirebaseInit />

        <div className={`${notoSansJP.className}`}>
          <Header />

          <div className="flex justify-center lg:px-4 lg:mt-6">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_730px_300px] gap-8">
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
                          <div className="bg-gray-200 text-black p-2 my-2 rounded shadow hover:bg-gray-300 hover:scale-102 transition-all">
                            {post.title}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="my-8">
                  <h2>プロフィール</h2>
                  <div className="text-center">
                    <Image
                      src="/bunbun.webp"
                      alt="Bunbun"
                      width={100}
                      height={100}
                      className="rounded-full mx-auto mt-4 shadow-md"
                    />
                    <span className="text-lg font-medium">Bunbun</span>
                    <div className="flex justify-center gap-4 mt-2">
                      <span>
                        <a
                          href="https://x.com/potetosa8101911"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitterへ遷移"
                        >
                          <FaSquareTwitter size={48} color="#313030" />
                        </a>
                      </span>

                      <span>
                        <a
                          href="https://www.youtube.com/@gamecenterbunbun"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="YouTubeへ遷移"
                        >
                          <FaYoutube size={48} color="#313030" />
                        </a>
                      </span>

                      <span>
                        <a
                          href="https://github.com/tamago572"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHubへ遷移"
                        >
                          <FaSquareGithub size={48} color="#313030" />
                        </a>
                      </span>

                      <span>
                        <a
                          href="https://bsky.app/profile/bunbunapp.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Blueskyへ遷移"
                        >
                          <FaSquareBluesky size={48} color="#313030" />
                        </a>
                      </span>
                    </div>
                    <p>
                      Bunbun
                      Blogの管理人、Bunbunです。ソフトウェア開発・動画編集・アニメ鑑賞が趣味です。プログラミングやガジェットに関する情報を発信しています。
                    </p>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>

        <footer className="bg-white p-4 rounded-lg shadow-xl mt-10">
          <div className="mb-8">
            <h2 className="text-center text-gray-500 text-sm mb-2 !border-l-0 !border-b-0 !px-0">
              Site Links
            </h2>
            <div className="flex justify-center gap-4">
              <Link href="/" className="!text-gray-500 hover:underline">
                Home
              </Link>
              <Link href="/posts" className="!text-gray-500 hover:underline">
                Posts
              </Link>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="!text-gray-500 hover:underline"
              >
                GitHub
              </a>
            </div>
          </div>

          <p className="text-center text-gray-500 !my-2">
            &copy; {new Date().getFullYear()} Bunbun Blog. All rights reserved.
          </p>

          <p className="text-center text-gray-500 !my-2">
            Built Date: {new Date().toString()}
          </p>

          <p className="text-center text-gray-500 !my-2">
            CommitHash:
            <a
              href={`${repoUrl}/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="!text-gray-500"
            >
              {" "}
              {process.env.NEXT_PUBLIC_COMMIT_HASH}
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
