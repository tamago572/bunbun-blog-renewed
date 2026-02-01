import Image from "next/image";
import type React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { codeToHtml } from "shiki";
import HeadingList from "./HeadingList";

export default function MarkdownRenderer({ content }: { content: string }) {
  const MDComponents = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-3xl font-bold my-4" id={props.children?.toString()}>
        {props.children}
      </h1>
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-2xl font-bold my-4" id={props.children?.toString()}>
        {props.children}
      </h2>
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-xl font-bold my-4" id={props.children?.toString()}>
        {props.children}
      </h3>
    ),
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className="text-lg font-bold my-4" id={props.children?.toString()}>
        {props.children}
      </h4>
    ),
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5 className="text-base font-bold my-4" id={props.children?.toString()}>
        {props.children}
      </h5>
    ),
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6 className="text-sm font-bold my-4" id={props.children?.toString()}>
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
      const html = await codeToHtml(props.children?.toString() || "", {
        lang: props.className?.replace("language-", "") || "txt",
        theme: "one-dark-pro",
      });
      return (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="overflow-x-auto"
          style={{ backgroundColor: "#282c34" }}
        />
      );
    },
    headinglist: () => {
      // console.log(content);

      return <HeadingList markdown={content} />;
    },
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const src = typeof props.src === "string" ? props.src : "/demo.webp";
      return (
        <Image
          src={src}
          alt={props.alt || ""}
          className="my-4 max-w-full h-auto rounded-lg shadow-xl"
          width={720}
          height={480}
        />
      );
    },
    table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className="my-4 overflow-x-auto">
        <table
          className="min-w-[600px] w-full text-sm border border-stone-300 rounded"
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
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={MDComponents}
    >
      {content}
    </Markdown>
  );
}
