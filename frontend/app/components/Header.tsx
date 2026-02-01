import style from "./Header.module.scss";

export default function Header() {
  return (
    <header>
      <div className="text-center py-8">
        <span className="text-2xl">Bunbun Blog</span>
        <br />
        プログラミングやガジェットに関する情報を発信しています。
      </div>
      <ul className="flex gap-4 p-4 bg-stone-800 text-white shadow-md">
        <li>
          <a href="/" className={`${style.headerLink}`}>
            Bunbun Blog
          </a>
        </li>
        <li>
          <a href="/posts" className={`${style.headerLink}`}>
            Posts
          </a>
        </li>
      </ul>
    </header>
  );
}
