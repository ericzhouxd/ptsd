/**
 * Layout shared by all theorem pages.
 *
 * Just adds the compact site header (title + back-to-home link). The actual
 * immersive layout lives in each theorem's page.tsx so it can position the
 * scene, overlays, and floating controls independently.
 */
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/chrome/SiteHeader";

export default function TheoremsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30">
        <SiteHeader compact />
      </div>
      {children}
    </>
  );
}
