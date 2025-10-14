import type { Metadata } from "next";
import "./styles/top.css";
import AccessCounter from "./components/AccessCounter";
import { NewDecoration } from "./components/decorations/New";
import {
  getPostsSlug,
  getPostsTitle,
  getPostUpdateDate,
} from "./utils/articleIO";

export default async function Home() {
  // mdファイルが格納されているディレクトリを取得し、slugのみ返す
  const postsTitle = await getPostsTitle();
  const postsSlug = await getPostsSlug();
  const postsUpdateDates = await Promise.all(
    postsSlug.map((slug) => getPostUpdateDate(`${slug}.md`)),
  );

  return (
    <div className="text-black prose prose-zinc max-w-none">
      <h1 className="text-blue-700 text-4xl">
        *＊*＊*Welcome to Bunbun's Homepage!*＊*＊*
      </h1>
      <div className="marquee text-red-600">
        *＊*＊*＊*＊*＊*＊ぶんぶんのホームページへようこそ！*＊*＊*＊*＊*＊
      </div>
      <p>昔のホームページかと思うかもしれませんが、</p>
      <p>HTML5, Next.js, React, Firebaseで作られています。(*´艸｀*)</p>
      <p>PCやスマホ、プログラミングの技術系ブログを投稿をします。</p>

      <h2 className="accessCounter text-2xl">
        <AccessCounter />
      </h2>

      <hr />

      <h2 className="text-left text-purple-600 text-2xl">最近の記事</h2>
      <ul className="text-left">
        {postsTitle.map((title, index) => (
          <li key={title}>
            <a href={`/posts/${postsSlug[index]}`}>
              {title} -{" "}
              {postsUpdateDates[index]
                ? (postsUpdateDates[index] as Date).toLocaleDateString()
                : "No date"}
            </a>
            <NewDecoration />
          </li>
        ))}
      </ul>

      <span>[1]</span>
      <span>[&gt;]</span>
      <a href="/posts">記事一覧へ</a>

      <h2 className="text-2xl">リンク</h2>
      <ul className="text-left list-item">
        <li>
          <a href="https://github.com/tamago572">GitHub</a>
        </li>
        <li>
          <a href="https://twitter.com/potetosa8101911">Twitter</a>
        </li>
      </ul>
      <hr />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ホーム / Bunbun Blog",
    description: "PCやスマホ、プログラミングの技術系ブログを投稿します。",
  };
}
