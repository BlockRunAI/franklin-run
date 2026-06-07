import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SHOWCASE_ITEMS } from "@/lib/showcase-gallery";
import { cdnUrl } from "@/lib/cdn";

const SITE_URL = "https://franklin.run";
const abs = (p: string) => {
  const u = cdnUrl(p);
  return u.startsWith("http") ? u : `${SITE_URL}${u}`;
};

const TITLE = "Prompt Gallery — copy the exact AI image & video prompts";
const DESC =
  "A gallery of AI images and SeeDance videos made with Franklin (GPT Image 2 / SeeDance via BlockRun). Open any example to read and copy the exact prompt, then make your own.";

const firstImage = SHOWCASE_ITEMS.find((i) => i.type === "image");

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/gallery`,
    type: "website",
    images: firstImage ? [{ url: abs(firstImage.path) }] : undefined,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function GalleryIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESC,
    url: `${SITE_URL}/gallery`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: SHOWCASE_ITEMS.length,
      itemListElement: SHOWCASE_ITEMS.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/gallery/${it.id}`,
        name: it.title,
      })),
    },
  };

  return (
    <>
      <Header variant="paper" />
      <main className="gallery-page">
        <div className="gallery-wrap">
          <p className="gallery-eyebrow">Franklin · Prompt Gallery</p>
          <h1 className="gallery-h1">Real prompts you can copy</h1>
          <p className="gallery-lede">
            Every image and video below was made with Franklin — GPT Image 2 and SeeDance, paid per
            generation in USDC. Open any one to read the full prompt, copy it, and make your own.
          </p>

          <div className="gallery-grid">
            {SHOWCASE_ITEMS.map((it) => (
              <Link key={it.id} href={`/gallery/${it.id}`} className="gallery-card" aria-label={it.title}>
                <div className="gallery-thumb">
                  {it.type === "video" ? (
                    <video src={`${cdnUrl(it.path)}#t=0.1`} muted playsInline preload="metadata" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cdnUrl(it.path)} alt={it.title} loading="lazy" />
                  )}
                </div>
                <div className="gallery-card-meta">
                  <span className="gallery-card-title">{it.title}</span>
                  <span className="gallery-card-model">{it.model}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
