import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

const BASE = "https://multica.ai";
const OUT = new URL("../public/images", import.meta.url).pathname;

const assets = [
  { url: "/images/landing-bg.jpg", file: "landing-bg.jpg" },
  { url: "/images/landing-hero.png", file: "landing-hero.png" },
  { url: "/images/feature-bg.jpg", file: "feature-bg.jpg" },
  { url: "/images/feature-bg-2.jpg", file: "feature-bg-2.jpg" },
  { url: "/images/feature-bg-3.jpg", file: "feature-bg-3.jpg" },
  { url: "/images/feature-bg-4.jpg", file: "feature-bg-4.jpg" },
];

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

const download = async ({ url, file }) => {
  const fullUrl = `${BASE}${url}`;
  console.log(`Downloading ${fullUrl}...`);
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(`${OUT}/${file}`, buf);
    console.log(`  ✓ ${file} (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    console.error(`  ✗ ${file}: ${e.message}`);
  }
};

// Download 4 at a time
for (let i = 0; i < assets.length; i += 4) {
  await Promise.all(assets.slice(i, i + 4).map(download));
}

console.log("\nDone!");
