/**
 * Global MDX component map — required by @next/mdx in the App Router.
 *
 * When MDX content renders, every Markdown element (h1, p, strong, etc.) is
 * mapped through this table to a real React component. This is where we
 * apply our Tailwind typography to MDX prose without polluting the source
 * `.mdx` files with className attributes.
 *
 * Usage: just having this file at `src/mdx-components.tsx` is enough — Next
 * picks it up automatically. Do NOT put it at the project root; with
 * `--src-dir` it MUST live under `src/`.
 *
 * See LEARNING.md §"MDX in this project".
 */
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Inherit defaults; overlay components apply their own .prose-theorem class
    // on the wrapper, so element-level overrides here can stay minimal.
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        className="text-blue underline underline-offset-2 hover:text-yellow transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded bg-grid-dim/60 px-1.5 py-0.5 text-[0.9em] text-fg"
        {...props}
      >
        {children}
      </code>
    ),
    ...components,
  };
}
