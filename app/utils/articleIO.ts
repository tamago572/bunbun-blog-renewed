import { exec } from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";
import matter from "gray-matter";

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
  created_at: Date | null;
  matterData: PostMatterData;
};

export type PostMatterData = {
  tags?: string[];
}

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
 * 必要な情報を個別に取得するより効率的
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
  const filename = `${slug}.md`;
  const filePath = `${POST_PATH}/${filename}`;

  const integratedContent = await fs.promises.readFile(filePath, "utf-8");
  const title = extractTitleFromContent(integratedContent);

  const { data: matterData, content } = matter(integratedContent);

  let updatedDate: Date | null = null;
  let created_at: Date | null = null;

  try {
    const { stdout } = await execAsync(
      `git log -1 --pretty=format:%cI -- "${filePath}"`,
    );

    if (stdout.trim()) {
      updatedDate = new Date(stdout.trim());
    } else {
      const stats = await fs.promises.stat(filePath);
      updatedDate = stats.mtime;
    }
  } catch (error) {
    console.error(
      `Error getting git date for ${filename}, falling back to mtime:`,
      error,
    );
    try {
      const stats = await fs.promises.stat(filePath);
      updatedDate = stats.mtime;
    } catch (statError) {
      console.error(`Error getting file stats for ${filename}:`, statError);
    }
  }

  try {
    const { stdout: createOut } = await execAsync(
      `git log --diff-filter=A --follow --format=%cI -1 -- "${filePath}"`,
    );

    if (createOut.trim()) {
      created_at = new Date(createOut.trim());
    } else {
      const stats = await fs.promises.stat(filePath);
      created_at = stats.birthtime;
    }
  } catch (error) {
    console.error(
      `Error getting git create date for ${filename}, falling back to birthtime:`,
      error,
    );
    try {
      const stats = await fs.promises.stat(filePath);
      created_at = stats.birthtime;
    } catch (statError) {
      console.error(`Error getting file stats for ${filename}:`, statError);
    }
  }

  return {
    content,
    title,
    slug,
    updatedDate,
    created_at,
    matterData
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
  const filenames = await fs.promises.readdir(POST_PATH);
  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => {
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
 * sortedPosts.slice(0, 5).forEach(post => {
 *   console.log(post.title);1
 * });
 * ```
 */
export async function getAllPostsSortedByUpdatedDate(): Promise<Post[]> {
  const posts = await getAllPosts();

  posts.sort((a, b) => {
    if (!a.updatedDate && !b.updatedDate) return 0;
    if (!a.updatedDate) return 1;
    if (!b.updatedDate) return -1;
    return b.updatedDate.getTime() - a.updatedDate.getTime();
  });

  return posts;
}

/**
 * すべての記事データを作成日時順（降順：新しい順）にソートして取得する
 * ブログのトップページや記事一覧ページでの使用を想定
 *
 * @returns 作成日時順にソートされた記事データの配列（新しい記事が先頭）
 */
export async function getAllPostsSortedByCreatedDate(): Promise<Post[]> {
  const posts = await getAllPosts();

  posts.sort((a, b) => {
    if (!a.created_at && !b.created_at) return 0;
    if (!a.created_at) return 1;
    if (!b.created_at) return -1;
    return b.created_at.getTime() - a.created_at.getTime();
  });

  return posts;
}



/**
 * 指定された記事の前後の記事を取得する（推奨）
 * 更新日時順で、現在の記事の前（新しい）と後（古い）の記事を返す
 *
 * この関数は1回の呼び出しで前後両方の記事情報を効率的に取得できます。
 * 記事ページのナビゲーション（前へ・次へリンク）での使用を想定しています。
 *
 * @param currentSlug - 現在の記事のスラッグ
 * @returns 前の記事と次の記事のPostオブジェクト（存在しない場合は null）
 *
 * @example
 * ```typescript
 * const { previous, next } = await getAdjacentPosts("my-article");
 * if (previous) {
 *   console.log(`前: ${previous.title} (/posts/${previous.slug})`);
 * }
 * if (next) {
 *   console.log(`次: ${next.title} (/posts/${next.slug})`);
 * }
 * ```
 */
export async function getAdjacentPosts(currentSlug: string): Promise<{
  previous: Post | null;
  next: Post | null;
}> {
  const posts = await getAllPostsSortedByCreatedDate();
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
    previous: currentIndex + 1 < posts.length ? posts[currentIndex + 1] : null,
  };
}

/**
 * 指定された記事の1つ前（新しい）の記事を取得する
 * 更新日時順で、現在の記事より新しい記事を返す
 *
 * 注意: 前後両方の記事が必要な場合は、getAdjacentPosts() を使用する方が効率的です。
 *
 * @param currentSlug - 現在の記事のスラッグ
 * @returns 前の記事のPostオブジェクト（存在しない場合は null）
 *
 * @example
 * ```typescript
 * const previousPost = await getPreviousPost("my-article");
 * if (previousPost) {
 *   console.log(`前の記事: ${previousPost.title}`);
 * }
 * ```
 */
export async function getPreviousPost(
  currentSlug: string,
): Promise<Post | null> {
  const { previous } = await getAdjacentPosts(currentSlug);
  return previous;
}

/**
 * 指定された記事の1つ次（古い）の記事を取得する
 * 更新日時順で、現在の記事より古い記事を返す
 *
 * 注意: 前後両方の記事が必要な場合は、getAdjacentPosts() を使用する方が効率的です。
 *
 * @param currentSlug - 現在の記事のスラッグ
 * @returns 次の記事のPostオブジェクト（存在しない場合は null）
 *
 * @example
 * ```typescript
 * const nextPost = await getNextPost("my-article");
 * if (nextPost) {
 *   console.log(`次の記事: ${nextPost.title}`);
 * }
 * ```
 */
export async function getNextPost(currentSlug: string): Promise<Post | null> {
  const { next } = await getAdjacentPosts(currentSlug);
  return next;
}

/**
 * すべての記事のスラッグ（ファイル名から .md を除いたもの）を取得する
 * @returns スラッグの配列
 */
export async function getPostsSlug(): Promise<string[]> {
  const postfiles = await fs.promises.readdir(POST_PATH);
  return postfiles
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}


export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();

  const tags: string[] = posts.flatMap((post) => {
    return post.matterData.tags || [];
  });
  return [...new Set(tags)];
}
