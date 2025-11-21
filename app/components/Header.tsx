import style from "./Header.module.scss";

export default function Header() {
  return (
    <header>
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
