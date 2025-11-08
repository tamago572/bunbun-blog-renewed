import { exec } from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";

// execを async/await で使えるように変換
const execAsync = promisify(exec);

// 記事ファイルが格納されているディレクトリのパス
const POST_PATH = "posts";

/**
 * 記事の完全なデータ構造
 * @property content - Markdown形式の記事本文
 * @property title - 記事のタイトル（Markdownの最初の見出し1から抽出）
 * @property slug - 記事のスラッグ（URLに使用される識別子、ファイル名から.mdを除いたもの）
 * @property updatedDate - 記事の最終更新日時（Gitのコミット履歴から取得）
 */
export type Post = {
  content: string;
  title: string;
  slug: string;
  updatedDate: Date | null;
};

/**
 * Markdownコンテンツから最初の見出し1（# タイトル）を抽出する
 * @param content - Markdown形式のテキスト
 * @returns タイトル文字列（見つからない場合は "Untitled"）
 */
function extractTitleFromContent(content: string): string {
  // 正規表現で最初の見出し1（# で始まる行）を検索
  const match = content.match(/^# (.+)$/m);
  // マッチした場合はキャプチャグループ（見出しの本文）を返す
  return match ? match[1] : "Untitled";
}

/**
 * 指定されたスラッグの記事データを完全な形で取得する（推奨）
 * この関数は1回のファイル読み込みで記事のすべての情報を取得するため、
 * 個別の関数（getPostContent, getPostTitle など）を複数回呼び出すより効率的
 * 
 * @param slug - 記事のスラッグ（例: "example"）
 * @returns 記事の完全なデータ（Post型オブジェクト）
 * @throws ファイルが存在しない場合やアクセスできない場合にエラーをスロー
 * 
 * @example
 * ```typescript
 * const post = await getPost("my-article");
 * console.log(post.title);        // "記事タイトル"
 * console.log(post.content);      // "# 記事タイトル\n\n本文..."
 * console.log(post.slug);         // "my-article"
 * console.log(post.updatedDate);  // Date オブジェクト
 * ```
 */
export async function getPost(slug: string): Promise<Post> {
  // スラッグからファイル名を生成
  const filename = `${slug}.md`;
  const filePath = `${POST_PATH}/${filename}`;

  // 1. ファイルの内容を読み込む
  const content = await fs.promises.readFile(filePath, "utf-8");

  // 2. コンテンツからタイトルを抽出
  const title = extractTitleFromContent(content);

  // 3. Gitの履歴から最終更新日時を取得
  let updatedDate: Date | null = null;
  try {
    // git log コマンドで最終コミット日時を取得（ISO 8601形式）
    const { stdout } = await execAsync(
      `git log -1 --pretty=format:%cI -- "${filePath}"`,
    );

    if (stdout.trim()) {
      // コミット日時が見つかればDateオブジェクトに変換
      updatedDate = new Date(stdout.trim());
    } else {
      // Git履歴にない場合（新規ファイルなど）は、ファイルのmtimeを使用
      const stats = await fs.promises.stat(filePath);
      updatedDate = stats.mtime;
    }
  } catch (error) {
    // Gitコマンドが失敗した場合のフォールバック処理
    console.error(`Error getting git date for ${filename}, falling back to mtime:`, error);
    try {
      const stats = await fs.promises.stat(filePath);
      updatedDate = stats.mtime;
    } catch (statError) {
      // ファイルの情報も取得できない場合は null のまま
      console.error(`Error getting file stats for ${filename}:`, statError);
    }
  }

  // 4. すべての情報を含むPostオブジェクトを返す
  return {
    content,
    title,
    slug,
    updatedDate,
  };
}

/**
 * すべての記事データを取得する
 * 各記事のファイルを読み込み、Post型オブジェクトの配列として返す
 * 
 * @returns すべての記事データの配列
 * 
 * @example
 * ```typescript
 * const posts = await getAllPosts();
 * posts.forEach(post => {
 *   console.log(`${post.title} (更新日: ${post.updatedDate})`);
 * });
 * ```
 */
export async function getAllPosts(): Promise<Post[]> {
  // postsディレクトリ内のすべてのファイル名を取得
  const filenames = await fs.promises.readdir(POST_PATH);
  
  // 各ファイル名からスラッグを抽出し、getPost()で記事データを取得
  // Promise.all() で並列処理することで高速化
  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md")) // .mdファイルのみ対象
      .map((filename) => {
        // ファイル名から拡張子を除去してスラッグに変換
        const slug = filename.replace(/\.md$/, "");
        return getPost(slug);
      }),
  );

  return posts;
}

/**
 * すべての記事データを更新日時順（降順：新しい順）にソートして取得する
 * ブログのトップページや記事一覧ページでの使用を想定
 * 
 * @returns 更新日時順にソートされた記事データの配列（新しい記事が先頭）
 * 
 * @example
 * ```typescript
 * const sortedPosts = await getAllPostsSortedByDate();
 * // 最新の5件を表示
 * sortedPosts.slice(0, 5).forEach(post => {
 *   console.log(post.title);
 * });
 * ```
 */
export async function getAllPostsSortedByDate(): Promise<Post[]> {
  // すべての記事データを取得
  const posts = await getAllPosts();

  // 更新日時で降順ソート（新しい記事が先頭）
  posts.sort((a, b) => {
    // 両方ともnullの場合は順序を変えない
    if (!a.updatedDate && !b.updatedDate) return 0;
    // aだけnullの場合は後ろに配置
    if (!a.updatedDate) return 1;
    // bだけnullの場合は前に配置
    if (!b.updatedDate) return -1;
    // 両方とも日付がある場合は降順（新しい順）でソート
    return b.updatedDate.getTime() - a.updatedDate.getTime();
  });

  return posts;
}

/**
 * 指定されたファイル名の記事内容を取得する
 * 
 * @deprecated この関数は非効率的です。代わりに getPost() を使用してください。
 * getPost() は1回のファイル読み込みで記事のすべての情報（content, title, slug, updatedDate）を取得できます。
 * 
 * @param filename - 記事ファイル名（例: "example.md"）
 * @returns 記事の内容（文字列）
 * 
 * @example
 * ```typescript
 * // 非推奨
 * const content = await getPostContent("example.md");
 * 
 * // 推奨
 * const post = await getPost("example");
 * const content = post.content;
 * ```
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
 * 
 * @deprecated この関数はファイルを読み込んでタイトルのみを返すため非効率的です。
 * 代わりに getPost() または getAllPosts() の使用を推奨します。
 * 
 * Markdown の最初の見出し1（# タイトル）を抽出
 * 
 * @param filename - 記事ファイル名（例: "example.md"）
 * @returns タイトル文字列（見つからない場合は "Untitled"）
 * 
 * @example
 * ```typescript
 * // 非推奨
 * const title = await getPostTitle("example.md");
 * 
 * // 推奨
 * const post = await getPost("example");
 * const title = post.title;
 * ```
 */
export async function getPostTitle(filename: string): Promise<string> {
  const content = await getPostContent(filename);
  return extractTitleFromContent(content);
}

/**
 * 記事の最終更新日を取得する
 * 
 * @deprecated この関数は非効率的です。代わりに getPost() を使用してください。
 * getPost() は1回のファイル読み込みで記事のすべての情報を取得できます。
 * 
 * Gitのコミット履歴から取得し、履歴がない場合はファイルのmtimeを使用
 * 
 * @param filename - 記事ファイル名（例: "example.md"）
 * @returns 最終更新日（取得できない場合は null）
 * 
 * @example
 * ```typescript
 * // 非推奨
 * const date = await getPostUpdateDate("example.md");
 * 
 * // 推奨
 * const post = await getPost("example");
 * const date = post.updatedDate;
 * ```
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
 * 
 * @deprecated この関数は非効率的で、ファイル名との対応関係が失われます。
 * 代わりに getAllPosts() または getAllPostsSortedByDate() を使用してください。
 * 
 * @returns 各記事の最終更新日の配列（取得できない記事は null）
 * 
 * @example
 * ```typescript
 * // 非推奨
 * const dates = await getPostsUpdateDates();
 * 
 * // 推奨
 * const posts = await getAllPosts();
 * const dates = posts.map(post => post.updatedDate);
 * ```
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
 * 
 * @deprecated この関数は低レベル過ぎます。代わりに getAllPosts() を使用してください。
 * getAllPosts() は Post 型のオブジェクトとして、より使いやすい形式で記事データを返します。
 * 
 * @returns ファイル名の配列
 * 
 * @example
 * ```typescript
 * // 非推奨
 * const files = await getPostsFileList();
 * 
 * // 推奨
 * const posts = await getAllPosts();
 * const filenames = posts.map(post => `${post.slug}.md`);
 * ```
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
 * 
 * @deprecated この関数は非効率的で、各記事のファイルを複数回読み込みます。
 * 代わりに getAllPosts() を使用してください。
 * 
 * @returns タイトルの配列
 * 
 * @example
 * ```typescript
 * // 非推奨
 * const titles = await getPostsTitle();
 * 
 * // 推奨
 * const posts = await getAllPosts();
 * const titles = posts.map(post => post.title);
 * ```
 */
export async function getPostsTitle(): Promise<string[]> {
  const files = await getPostsFileList();
  const titles = await Promise.all(files.map((file) => getPostTitle(file)));
  return titles;
}

/**
 * 指定された記事より1つ古い記事のスラッグを取得する
 * 更新日時順で、現在の記事より古く、かつ最も新しい記事を返す
 * 
 * @param currentSlug - 現在の記事のスラッグ
 * @returns 前の記事のスラッグ（存在しない場合は null）
 * 
 * @example
 * ```typescript
 * const prevSlug = await getPreviousPostSlug("my-latest-article");
 * if (prevSlug) {
 *   console.log(`前の記事: /posts/${prevSlug}`);
 * }
 * ```
 */
export async function getPreviousPostSlug(
  currentSlug: string,
): Promise<string | null> {
  // すべての記事を更新日時順（新しい順）で取得
  const posts = await getAllPostsSortedByDate();

  // 現在の記事のインデックスを探す
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  
  // 現在の記事が見つからない場合はnullを返す
  if (currentIndex === -1) return null;

  // 現在の記事より1つ後ろ（古い）の記事があればそのスラッグを返す
  // currentIndex + 1 が配列の範囲内かチェック
  if (currentIndex + 1 < posts.length) {
    return posts[currentIndex + 1].slug;
  }

  // これが最も古い記事の場合はnullを返す
  return null;
}
