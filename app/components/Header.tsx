import Link from "next/link";
import style from "./Header.module.scss";

export default function Header() {
  return (
    <header>
        <div className="text-center py-8">
          <Link href="/" className={`${style.headerLink}`}>
            <span className="text-2xl">Bunbun Blog</span>
            <br />
            プログラミングやガジェットに関する情報を発信しています。
          </Link>
        </div>
      <ul className="flex gap-4 p-4 bg-stone-800 text-white shadow-md">
        <li>
          <a href="/" className={`${style.headerItem}`}>
            Bunbun Blog
          </a>
        </li>
        <li>
          <a href="/posts" className={`${style.headerItem}`}>
            Posts
          </a>
        </li>
      </ul>
    </header>
  );
}
