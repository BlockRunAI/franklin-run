/**
 * Returns a fully-qualified CDN URL when NEXT_PUBLIC_CDN_BASE is set,
 * otherwise returns the path as-is so local dev keeps serving from /public.
 *
 * Env var examples:
 *   NEXT_PUBLIC_CDN_BASE=                                                  → /seo/blog/en/foo.png  (local dev)
 *   NEXT_PUBLIC_CDN_BASE=https://storage.googleapis.com/franklin-run-assets → https://storage.googleapis.com/franklin-run-assets/seo/blog/en/foo.png
 *   NEXT_PUBLIC_CDN_BASE=https://cdn.franklin.run                          → https://cdn.franklin.run/seo/blog/en/foo.png
 */
export function cdnUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_CDN_BASE?.replace(/\/$/, "") ?? "";
  if (!base) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * Server-side variant for code that needs the *physical* file location
 * (e.g. opengraph-image.tsx reading the portrait at build/request time).
 * Returns:
 *   - the public CDN URL (fetched over HTTP) when CDN_BASE is set
 *   - the local public/ path string when not
 */
export function assetSource(path: string): {
  kind: "remote" | "local";
  url: string;
} {
  const base = process.env.NEXT_PUBLIC_CDN_BASE?.replace(/\/$/, "") ?? "";
  if (!base) {
    return { kind: "local", url: path };
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return { kind: "remote", url: `${base}${normalized}` };
}
