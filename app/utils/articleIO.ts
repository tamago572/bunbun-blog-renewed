import fs from "node:fs";

const POST_PATH = "posts/";

export async function getPostContent(filename: string): Promise<string> {
  const content = await fs.promises.readFile(
    `${POST_PATH}/${filename}`,
    "utf-8",
  );
  return content;
}

export async function getPostTitle(filename: string): Promise<string> {
  const content = await getPostContent(filename);
  const match = content.match(/^# (.+)$/m);
  return match ? match[1] : "Untitled";
}

export async function getPostUpdateDate(
  filename: string,
): Promise<Date | null> {
  const date = await fs.promises.stat(`${POST_PATH}/${filename}`);
  return date ? date.mtime : null; // mtime→ファイルの最終更新日時を取得
}

export async function getPostsUpdateDates(): Promise<(Date | null)[]> {
  const postfiles = await getPostsFileList();
  const dates = await Promise.all(
    postfiles.map((file) => getPostUpdateDate(file)),
  );
  return dates;
}

export async function getPostsFileList(): Promise<string[]> {
  const postfiles = await fs.promises.readdir(POST_PATH);
  return postfiles;
}

export async function getPostsSlug(): Promise<string[]> {
  const postfiles = await getPostsFileList();
  return postfiles.map((filename) => filename.replace(/\.md$/, ""));
}

export async function getPostsTitle(): Promise<string[]> {
  const files = await getPostsFileList();
  const titles = await Promise.all(files.map((file) => getPostTitle(file)));
  return titles;
}
