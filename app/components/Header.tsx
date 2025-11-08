import style from "./Header.module.scss";

export default function Header() {
  return (
    <div>
      <ul className="flex gap-4 p-4 bg-blue-200">
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
    </div>
  );
}
