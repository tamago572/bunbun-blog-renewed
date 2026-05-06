import Link from "next/link";
import { getAllTags } from "@/app/utils/articleIO"

export default async function TagsPage() {
  const tags = await getAllTags();
  return (
    <>
      <h1>タグ一覧</h1>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            <Link href={`/posts/tags/${encodeURIComponent(tag)}`}>#{tag}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
