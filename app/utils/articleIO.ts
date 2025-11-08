import { exec } from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";

// execを async/await で使えるように変換
const execAsync = promisify(exec);

// 記事ファイルが格納されているディレクトリのパス
const POST_PATH = "posts";

/**
 * 指定されたファイル名の記事内容を取得する
 * @param filename - 記事ファイル名（例: "example.md"）
 * @returns 記事の内容（文字列）
 */
export async function getPostContent(filename: string): Promise<string> {
  console.log(`Reading post content from ${filename}`);
  const content = await fs.promises.readFile(
    `${POST_PATH}/${filename}`,
    "utf-8",
  );
  return content;
}

/**
 * 記事のタイトルを取得する
 * Markdown の最初の見出し1（# タイトル）を抽出
 * @param filename - 記事ファイル名
 * @returns タイトル文字列（見つからない場合は "Untitled"）
 */
export async function getPostTitle(filename: string): Promise<string> {
  const content = await getPostContent(filename);
  const match = content.match(/^# (.+)$/m);
  return match ? match[1] : "Untitled";
}

/**
 * 記事の最終更新日を取得する
 * Gitのコミット履歴から取得し、履歴がない場合はファイルのmtimeを使用
 * @param filename - 記事ファイル名
 * @returns 最終更新日（取得できない場合は null）
 */
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

/**
 * すべての記事の最終更新日を配列で取得する
 * @returns 各記事の最終更新日の配列（取得できない記事は null）
 */
export async function getPostsUpdateDates(): Promise<(Date | null)[]> {
  const postfiles = await getPostsFileList();
  const dates = await Promise.all(
    postfiles.map((file) => getPostUpdateDate(file)),
  );
  return dates;
}

/**
 * posts ディレクトリ内のすべてのファイル名を取得する
 * @returns ファイル名の配列
 */
export async function getPostsFileList(): Promise<string[]> {
  const postfiles = await fs.promises.readdir(POST_PATH);
  return postfiles;
}

/**
 * すべての記事のスラッグ（ファイル名から .md を除いたもの）を取得する
 * @returns スラッグの配列
 */
export async function getPostsSlug(): Promise<string[]> {
  const postfiles = await getPostsFileList();
  return postfiles.map((filename) => filename.replace(/\.md$/, ""));
}

/**
 * すべての記事のタイトルを取得する
 * @returns タイトルの配列
 */
export async function getPostsTitle(): Promise<string[]> {
  const files = await getPostsFileList();
  const titles = await Promise.all(files.map((file) => getPostTitle(file)));
  return titles;
}

/**
 * 指定された記事より1つ古い記事のスラッグを取得する
 * 更新日時順で、現在の記事より古く、かつ最も新しい記事を返す
 * @param currentSlug - 現在の記事のスラッグ
 * @returns 前の記事のスラッグ（存在しない場合は null）
 */
export async function getPreviousPostSlug(
  currentSlug: string,
): Promise<string | null> {
  const files = await getPostsFileList();
  const dates = await getPostsUpdateDates();

  // 現在の記事のインデックスを取得
  const currentIndex = files.findIndex(f => f.replace(/\.md$/, "") === currentSlug);
  if (currentIndex === -1) return null;

  const currentDate = dates[currentIndex];
  if (!currentDate) return null;

  // 現在の記事より古く、かつ最も新しい記事を探す
  let bestIndex: number | null = null;
  let bestDate: Date | null = null;

  for (let i = 0; i < files.length; i++) {
    if (i === currentIndex) continue; // 現在の記事はスキップ
    const d = dates[i];
    if (!d) continue; // 日付が取得できない記事はスキップ

    // 現在の記事より古く、かつこれまでで最も新しい日付なら更新
    if (d < currentDate) {
      if (!bestDate || d > bestDate) {
        bestDate = d;
        bestIndex = i;
      }
    }
  }

  // 前の記事が見つかればそのスラッグを返す
  return bestIndex !== null ? files[bestIndex].replace(/\.md$/, "") : null;
}
