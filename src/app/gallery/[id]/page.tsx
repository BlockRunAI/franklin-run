import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CopyPromptButton } from "@/components/gallery/CopyPromptButton";
import { GalleryShare } from "@/components/gallery/GalleryShare";
import {
  SHOWCASE_ITEMS,
  getShowcaseItem,
  showcaseDescription,
  showcasePoster,
} from "@/lib/showcase-gallery";
import { cdnUrl } from "@/lib/cdn";

const SITE_URL = "https://franklin.run";
const abs = (p: string) => {
  const u = cdnUrl(p);
  return u.startsWith("http") ? u : `${SITE_URL}${u}`;
};

export function generateStaticParams() {
  return SHOWCASE_ITEMS.map((it) => ({ id: it.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = getShowcaseItem(id);
  if (!item) return {};
  const title = `${item.title} — ${item.model} prompt · Franklin`;
  const description = showcaseDescription(item);
  const ogImage = abs(showcasePoster(item));
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/gallery/${id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/gallery/${id}`,
      type: "article",
      images: [{ url: ogImage }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function GalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getShowcaseItem(id);
  if (!item) notFound();

  const src = cdnUrl(item.path);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    url: `${SITE_URL}/gallery/${id}`,
    ...(item.type === "image"
      ? { image: abs(item.path) }
      : {
          video: {
            "@type": "VideoObject",
            name: item.title,
            contentUrl: abs(item.path),
            thumbnailUrl: abs(showcasePoster(item)),
            uploadDate: "2026-06-01",
          },
        }),
    ...(item.prompt ? { text: item.prompt, abstract: showcaseDescription(item) } : {}),
    creator: { "@type": "SoftwareApplication", name: "Franklin", applicationCategory: "AI agent" },
    about: item.model,
    ...(item.sourceUrl ? { isBasedOn: item.sourceUrl } : {}),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Gallery", item: `${SITE_URL}/gallery` },
      { "@type": "ListItem", position: 2, name: item.title, item: `${SITE_URL}/gallery/${id}` },
    ],
  };

  return (
    <>
      <Header variant="paper" />
      <main className="gallery-page">
        <div className="gallery-detail">
          <Link href="/gallery" className="gallery-back">
            <ArrowLeft className="h-4 w-4" /> Gallery
          </Link>

          <div className="gallery-detail-grid">
            <div className="gallery-detail-media">
              {item.type === "video" ? (
                <video src={src} poster={cdnUrl(showcasePoster(item))} controls autoPlay loop muted playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={item.title} />
              )}
            </div>

            <div className="gallery-detail-side">
              <h1 className="gallery-detail-title">{item.title}</h1>
              <p className="gallery-detail-meta">
                {item.model}
                {item.credit && (
                  <>
                    {" · "}
                    {item.sourceUrl ? (
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                        {item.credit}
                      </a>
                    ) : (
                      item.credit
                    )}
                  </>
                )}
              </p>

              {item.prompt ? (
                <>
                  <div className="gallery-prompt-head">
                    <span>Prompt</span>
                    <CopyPromptButton prompt={item.prompt} />
                  </div>
                  <pre className="gallery-prompt">{item.prompt}</pre>
                </>
              ) : (
                <p className="gallery-detail-note">
                  Assembled with the <code>/launch-film</code> skill (SeeDance).
                </p>
              )}

              <Link href={item.prompt ? `/chat?from=${item.id}` : "/chat"} className="gallery-cta">
                {item.prompt ? "Make your own — open this prompt in Franklin →" : "Make your own in Franklin →"}
              </Link>

              <GalleryShare url={`${SITE_URL}/gallery/${id}`} title={item.title} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
