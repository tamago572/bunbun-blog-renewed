import style from "./Header.module.scss";

export default function Header() {
  return (
    <div>
      <ul className="flex gap-4 p-4 bg-gray-200">
        <li>
          <a href="/" className={`${style.headerLink}`}>
            Home
          </a>
        </li>
        {/* <li>Articles</li> */}
      </ul>
    </div>
  );
}
