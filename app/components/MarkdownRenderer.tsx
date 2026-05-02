import Image from "next/image";
import type React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { codeToTokens } from "shiki";
import HeadingList from "./HeadingList";

export default function MarkdownRenderer({ content }: { content: string }) {
  const firstH2Index = content.search(/\r?\n##\s+/);
  const hasToc = firstH2Index !== -1;
  const markdownBeforeToc = hasToc ? content.slice(0, firstH2Index) : content;
  const markdownAfterToc = hasToc ? content.slice(firstH2Index + 1) : "";

  const MDComponents = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-3xl font-bold my-4" id={props.children?.toString().trim().replace(/\s+/g, "-")}>
        {props.children}
      </h1>
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-2xl font-bold my-4" id={props.children?.toString().trim().replace(/\s+/g, "-")}>
        {props.children}
      </h2>
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-xl font-bold my-4" id={props.children?.toString().trim().replace(/\s+/g, "-")}>
        {props.children}
      </h3>
    ),
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className="text-lg font-bold my-4" id={props.children?.toString().trim().replace(/\s+/g, "-")}>
        {props.children}
      </h4>
    ),
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5 className="text-base font-bold my-4" id={props.children?.toString().trim().replace(/\s+/g, "-")}>
        {props.children}
      </h5>
    ),
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6 className="text-sm font-bold my-4" id={props.children?.toString().trim().replace(/\s+/g, "-")}>
        {props.children}
      </h6>
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={props.href} className="text-blue-600 hover:underline">
        {props.children}
      </a>
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="my-2">{props.children}</p>
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc list-inside my-2">{props.children}</ul>
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal list-inside my-2">{props.children}</ol>
    ),
    li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
      <li className="my-1">{props.children}</li>
    ),
    code: async (props: React.HTMLAttributes<HTMLElement>) => {
      const result = await codeToTokens(props.children?.toString() || "", {
        lang: (props.className?.replace("language-", "") || "txt") as unknown as Parameters<typeof codeToTokens>[1]["lang"],
        theme: "one-dark-pro",
      });

      const lineKeyCounts = new Map<string, number>();
      const codeLines = result.tokens.reduce<React.ReactNode[]>((lines, line) => {
        const serialized = line.map((token) => `${token.offset}:${token.content}`).join("|") || "blank";
        const count = lineKeyCounts.get(serialized) ?? 0;
        lineKeyCounts.set(serialized, count + 1);
        const lineKey = count === 0 ? serialized : `${serialized}-${count}`;

        lines.push(
          <span key={lineKey} className="block whitespace-pre">
            {line.map((token) => (
              <span
                key={`${token.offset}:${token.content}`}
                style={{
                  color: token.color,
                  fontStyle: token.fontStyle === 1 ? "italic" : "normal",
                }}
              >
                {token.content}
              </span>
            ))}
          </span>,
        );

        return lines;
      }, []);

      return (
        <pre className="shiki overflow-x-auto rounded" style={{ backgroundColor: result.bg }}>
          <code>{codeLines}</code>
        </pre>
      );
    },
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const src = typeof props.src === "string" ? props.src : "/demo.webp";
      return (
        <Image
          src={src}
          alt={props.alt || ""}
          loading="eager"
          className="my-4 max-w-full h-auto rounded-lg shadow-xl"
          width={720}
          height={480}
        />
      );
    },
    table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className="my-4 overflow-x-auto">
        <table
          className="min-w-150 w-full text-sm border border-stone-300 rounded"
          {...props}
        >
          {props.children}
        </table>
      </div>
    ),
    thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-stone-100" {...props} />
    ),
    tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props} />
    ),
    tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className="border-b last:border-b-0 border-stone-300" {...props} />
    ),
    th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        className="px-2 py-3 text-left font-semibold border-r last:border-r-0 border-stone-300"
        {...props}
      />
    ),
    td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        className="px-2 py-2 align-top border-r last:border-r-0 border-stone-300"
        {...props}
      />
    ),
  };
  return (
    <>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={MDComponents}>
        {markdownBeforeToc}
      </Markdown>

      {hasToc ? <HeadingList markdown={content} /> : null}

      {hasToc ? (
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={MDComponents}>
          {markdownAfterToc}
        </Markdown>
      ) : null}
    </>
  );
}
