export type PaymentRail = "wallet" | "credit";
/** Poll URLs may be absolute or relative, but never become a browser fetch to another origin. */
export function mediaPollPath(value: string): string {
  const url = new URL(value, "https://blockrun.ai");
  if (!['https://blockrun.ai', 'https://sol.blockrun.ai', 'https://api.blockrun.ai', 'https://user.blockrun.ai', 'https://franklin.run'].includes(url.origin) || url.username || url.password || url.hash) throw new Error("Invalid media poll URL");
  const path = url.pathname.replace(/^\/api\/blockrun\//, "/").replace(/^\/api\//, "/");
  if (!/^\/v1\/(?:images|videos|audio)\/generations\/[A-Za-z0-9._~-]{1,200}$/.test(path)) throw new Error("Invalid media poll path");
  return `/api/blockrun${path}${url.search}`;
}
export function paymentRequestInit(rail: PaymentRail, init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  headers.set("x-franklin-payment", rail);
  if (rail === "credit" && headers.has("x-payment")) throw new Error("Credit requests cannot include a wallet payment");
  return { ...init, headers };
}
