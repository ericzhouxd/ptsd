/**
 * Next.js config — wires MDX so we can write theorem statements & proofs in `.mdx`
 * files with embedded LaTeX.
 *
 * The pipeline: an `.mdx` file is parsed by remark-math (recognizes `$...$` and
 * `$$...$$`), then rehype-katex turns the math AST into KaTeX-rendered HTML at
 * BUILD time. Result: math is server-rendered, no client-side LaTeX cost.
 *
 * `pageExtensions` tells Next that `.mdx` files in `app/` are valid pages too.
 * `import Statement from './statement.mdx'` works because @next/mdx makes each
 * `.mdx` file export a default React component.
 *
 * NOTE on plugin format: with Next 16 + Turbopack, plugins MUST be passed as
 * string specifiers (not function imports) so the loader options are
 * serializable across worker boundaries. See the bracketed `[name, opts]`
 * shape below — even with empty options object.
 *
 * See LEARNING.md §"MDX in this project" for background.
 */
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-math", {}]],
    rehypePlugins: [["rehype-katex", {}]],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
};

export default withMDX(nextConfig);
