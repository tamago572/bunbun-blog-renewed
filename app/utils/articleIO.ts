import { exec } from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";

const execAsync = promisify(exec);

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
  try {
    const filePath = `${POST_PATH}/${filename}`;
    // Gitのログからファイルの最終コミット日時（ISO 8601形式）を取得
    const { stdout } = await execAsync(
      `git log -1 --pretty=format:%cI -- "${filePath}"`,
    );

    if (stdout.trim()) {
      return new Date(stdout.trim());
    }

    // Git履歴にない場合は、ファイルのmtimeをフォールバックとして使用
    const stats = await fs.promises.stat(filePath);
    return stats.mtime;
  } catch (error) {
    console.error(`Error getting update date for ${filename}:`, error);
    // エラーが発生した場合は、ファイルのmtimeを使用
    try {
      const stats = await fs.promises.stat(`${POST_PATH}/${filename}`);
      return stats.mtime;
    } catch (statError) {
      console.error(`Error getting file stats for ${filename}:`, statError);
      return null;
    }
  }
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
