"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-6 text-2xl font-bold tracking-tight first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-6 text-xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold first:mt-0">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-3 leading-7 text-foreground/90">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-3 ml-5 list-disc space-y-1.5 marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 ml-5 list-decimal space-y-1.5 marker:text-primary">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline underline-offset-4"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-primary/40 bg-accent/50 py-1 pl-4 text-foreground/80 italic">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  hr: () => <hr className="my-6 border-border" />,
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className="font-mono text-sm text-foreground">{children}</code>
      );
    }
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-primary">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
};

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("text-[0.95rem]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
