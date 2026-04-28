import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  getPost,
  isValidLocale,
  LOCALE_META,
  PILLARS,
} from "@/lib/blog";
import { assetSource } from "@/lib/cdn";

export const alt = "Franklin Dispatch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) {
    return new Response("not found", { status: 404 });
  }
  const post = getPost(locale, slug);
  if (!post) {
    return new Response("not found", { status: 404 });
  }

  let portraitDataUrl: string | null = null;
  const source = assetSource(`/seo/blog/${locale}/${slug}-portrait.png`);
  try {
    let buf: Buffer | null = null;
    if (source.kind === "remote") {
      const res = await fetch(source.url, {
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        buf = Buffer.from(await res.arrayBuffer());
      }
    } else {
      const portraitPath = join(
        process.cwd(),
        "public",
        "seo",
        "blog",
        locale,
        `${slug}-portrait.png`,
      );
      buf = await readFile(portraitPath);
    }
    if (buf) {
      portraitDataUrl = `data:image/png;base64,${buf.toString("base64")}`;
    }
  } catch {
    portraitDataUrl = null;
  }

  const title = post.frontmatter.title;
  const pillarLabel =
    locale === "zh-CN"
      ? PILLARS[post.frontmatter.pillar].labelZh
      : PILLARS[post.frontmatter.pillar].label;
  const localeLabel = LOCALE_META[locale].nativeLabel;
  const isCJK = locale === "zh-CN" || locale === "ja" || locale === "ko";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0d12",
          padding: 48,
          fontFamily: "serif",
          color: "#f2e9d4",
          position: "relative",
        }}
      >
        {/* Banknote frame */}
        <div
          style={{
            position: "absolute",
            inset: 18,
            border: "1px solid rgba(201,162,39,0.55)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid rgba(201,162,39,0.25)",
            display: "flex",
          }}
        />

        {/* Top stripe */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(201,162,39,0.85)",
            fontSize: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                background: "#C9A227",
                borderRadius: 999,
                display: "block",
              }}
            />
            <span>FRANKLIN · DISPATCH</span>
          </div>
          <span>{pillarLabel}</span>
        </div>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flex: 1,
            marginTop: 32,
            gap: 36,
          }}
        >
          {portraitDataUrl ? (
            <div
              style={{
                width: 360,
                height: 460,
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid rgba(201,162,39,0.45)",
                display: "flex",
                flexShrink: 0,
              }}
            >
              <img
                src={portraitDataUrl}
                alt=""
                width={360}
                height={460}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 360,
                height: 460,
                borderRadius: 6,
                border: "1px solid rgba(201,162,39,0.45)",
                background:
                  "radial-gradient(circle at 50% 40%, rgba(201,162,39,0.18), transparent 60%), #0d1117",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C9A227",
                fontSize: 96,
                flexShrink: 0,
              }}
            >
              ƒ
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: "#C9A227",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                fontFamily: "monospace",
                marginBottom: 16,
              }}
            >
              {localeLabel}
            </div>
            <div
              style={{
                fontSize: isCJK ? 64 : 56,
                lineHeight: 1.05,
                letterSpacing: -1,
                color: "#ffffff",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: "auto",
                paddingTop: 24,
                borderTop: "1px solid rgba(201,162,39,0.35)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                fontFamily: "monospace",
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(242,233,212,0.65)",
              }}
            >
              <span>franklin.run</span>
              <span>USDC · X402 · OPEN SOURCE</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
