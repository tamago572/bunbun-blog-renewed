// マークダウン(string)を突っ込むと目次を生成するコンポーネント
// Usage: <HeadingList markdown={markdown} />

import styles from "./HeadingList.module.scss";

const HeadingList = ({ markdown }: { markdown: string }) => {
  const lines = markdown.split("\n");
  const headingArray = lines.filter((line) => line.startsWith("#"));
  console.log(headingArray);

  const headingList = headingArray.map((heading, i) => {
    const level = heading.search(/\s/);
    console.log(heading, " level: ", level, "\n");
    const text = heading.slice(level + 1);
    console.log(text);

    const aTag = (
      <a href={`#${text}`} className={styles.list_item}>
        ➧ {text}
      </a>
    );

    if (level === 2) {
      return (
        <li key={i} className={styles.list_item_h2}>
          {aTag}
        </li>
      );
    }
    if (level === 3) {
      return (
        <li key={i} className={styles.list_item_h3}>
          {aTag}
        </li>
      );
    }
    if (level === 4) {
      return (
        <li key={i} className={styles.list_item_h4}>
          {aTag}
        </li>
      );
    }
    if (level === 5) {
      return (
        <li key={i} className={styles.list_item_h5}>
          {aTag}
        </li>
      );
    }

    return <li key={i}>{aTag}</li>;
  });

  return (
    <div className={styles.container}>
      <h3>目次</h3>
      <ul className={styles.heading_list}>{headingList}</ul>
    </div>
  );
};

export default HeadingList;
