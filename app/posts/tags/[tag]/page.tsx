import { notFound } from "next/navigation";
import { getAllTags } from "@/app/utils/articleIO";

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = await params;
  const tags = await getAllTags();

  console.log("Available tags:", tags);

  console.log("Requested tag:", tag);

  console.log("Decoded requested tag:", decodeURIComponent(tag));

  if (!tags.includes(decodeURIComponent(tag))) {
    notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold">#{decodeURIComponent(tag)} の記事一覧</h1>
      {"TODO: タグに紐づく記事の一覧を表示する"}
    </>
  );
};

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}
