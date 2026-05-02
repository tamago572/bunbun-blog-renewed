// マークダウン(string)を突っ込むと目次を生成するコンポーネント
// Usage: <HeadingList markdown={markdown} />

import styles from "./HeadingList.module.scss";

const normalizeHeadingId = (text: string) => text.trim().replace(/\s+/g, "-");

const hashHeading = (text: string) => {
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return hash.toString(36);
};

const HeadingList = ({ markdown }: { markdown: string }) => {
  const lines = markdown.split("\n");
  const headingArray = lines.filter((line) => line.startsWith("#"));
  // console.log(headingArray);

  const headingList = headingArray.map((heading) => {
    const level = heading.search(/\s/);
    // console.log(heading, " level: ", level, "\n");
    const text = heading.slice(level + 1);
    // console.log(text);
    const headingId = normalizeHeadingId(text);
    const key = `${level}-${hashHeading(text)}`;

    const aTag = (
      <a href={`#${headingId}`} className="hover:underline text-stone-900">
        ➧ {text}
      </a>
    );

    if (level === 1) return null;

    if (level === 2) {
      return (
        <li key={key} className={styles.list_item_h2}>
          {aTag}
        </li>
      );
    }
    if (level === 3) {
      return (
        <li key={key} className={styles.list_item_h3}>
          {aTag}
        </li>
      );
    }
    if (level === 4) {
      return (
        <li key={key} className={styles.list_item_h4}>
          {aTag}
        </li>
      );
    }
    if (level === 5) {
      return (
        <li key={key} className={styles.list_item_h5}>
          {aTag}
        </li>
      );
    }

    return <li key={key}>{aTag}</li>;
  });

  return (
    <div className="bg-stone-100 pt-2 rounded-lg shadow-md pb-16 my-8">
      <p className="text-xl font-bold text-center text-stone-700">目次</p>
      <ul className={styles.heading_list}>{headingList}</ul>
    </div>
  );
};

export default HeadingList;
