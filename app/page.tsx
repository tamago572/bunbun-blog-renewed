import fs from "node:fs";
import "./top.css";

const POST_PATH = "posts/";

export default async function Home() {
    // mdファイルが格納されているディレクトリを取得し、slugのみ返す
    const postfiles = await fs.promises.readdir(POST_PATH);
    const posts = postfiles.map((filename) => filename.replace(/\.md$/, ""));
    const titles = posts.map((post) => {
      return fs.promises.readFile(`${POST_PATH}/${post}.md`, "utf-8").then((content) => {
        return content.slice(2, content.indexOf("\n"));
      });
    })

    return (
    <div>
      <h1>*＊*＊Welcome to Bunbun's Homepage!*＊*＊</h1>
      <hr />
      <div className="marquee">*＊*＊*＊*＊*＊*＊ぶんぶんのホームページへようこそ！*＊*＊*＊*＊*＊</div>
      <hr />
      <p>昔のホームページかと思うかもしれませんが、</p>
      <p>HTML5, Next.js, React, Firebaseで作られています。</p>
      <p>PCやスマホ、プログラミングの技術系ブログを投稿をします。</p>
      <hr />

      <h2 style={{ textAlign: "left" }}>最近の記事</h2>
      <ul style={{ textAlign: "left" }}>
        {posts.map((post, index) => (
          <li key={post}>
            <a href={`/posts/${post}`}>{titles[index]}</a>
          </li>
        ))}
      </ul>

      <span>[1]</span>
      <span>[&gt;]</span>

      <hr />
      <h2>リンク</h2>
      <ul style={{ textAlign: "left" }}>
        <li>
          <a href="https://github.com/tamago572">GitHub</a>
        </li>
        <li>
          <a href="https://twitter.com/potetosa8101911">Twitter</a>
        </li>
      </ul>
      <hr />
      <p>ソースコード: <a href="https://github.com/tamago572/bunbun-blog-renewed">GitHub</a></p>
      <p>Built date: {new Date().toLocaleString()}</p>
      <p>© 2025 Bunbun</p>
    </div>
  );
}
