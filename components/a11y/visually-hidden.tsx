/**
 * VisuallyHidden — screen-reader-only text wrapper.
 *
 * Use to add accessible labels to icon-only buttons, decorative links that
 * carry meaning ("GitHub" with an external-link icon), or any element where
 * the visible label alone is ambiguous (e.g. "View details" repeated in a list).
 *
 * Does NOT use `display:none` or `visibility:hidden` — content remains in the
 * accessibility tree and reachable by keyboard.
 */

import * as React from "react";

export function VisuallyHidden({
  children,
  asChild = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  if (asChild) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <span className="sr-only">{children}</span>;
}
