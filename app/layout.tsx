import type { Metadata } from "next";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "Bunbun Blog",
  description: "PCやスマホ、プログラミングの技術系ブログを投稿します。",
  keywords: ["ブログ", "技術ブログ", "プログラミング", "PC", "スマホ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const commitHash = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA;
  const shortHash = commitHash?.slice(0, 7);
  const repoUrl = "https://github.com/tamago572/bunbun-blog-renewed";

  return (
    <html lang="ja">
      <body>
        <>{children}</>
        <footer>
          <p>
            Built date:{" "}
            {new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
            {shortHash && (
              <>
                {" (commit: "}
                <a
                  href={`${repoUrl}/commit/${commitHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortHash}
                </a>
                {")"}
              </>
            )}
          </p>
          <p>
            Source code:{" "}
            <a href="https://github.com/tamago572/bunbun-blog-renewed">
              GitHub
            </a>
          </p>
          <p>© {new Date().getFullYear()} Bunbun</p>
        </footer>
      </body>
    </html>
  );
}
