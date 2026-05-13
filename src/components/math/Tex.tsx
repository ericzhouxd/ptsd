/**
 * Tex — render a LaTeX string as an inline KaTeX HTML fragment.
 *
 * Used for math labels OUTSIDE the MDX flow — e.g., labels on vector arrows
 * inside the 3D scene, or button labels in the control panel ("M e₁").
 *
 * Inside MDX, you write `$x^2$` directly — that's handled by the
 * remark-math + rehype-katex pipeline at build time. This component is for
 * the runtime cases.
 *
 * Concepts demonstrated:
 *   • katex.renderToString — sync, returns an HTML string. We dangerouslySetInnerHTML
 *     it. Safe because the input is OUR static math, not user input.
 *   • The `displayMode` flag toggles inline ($) vs. display ($$) layout.
 *
 * See LEARNING.md §"KaTeX".
 */
import katex from "katex";

export function Tex({
  children,
  display = false,
  className = "",
}: {
  children: string;
  display?: boolean;
  className?: string;
}) {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
    output: "html",
  });
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
