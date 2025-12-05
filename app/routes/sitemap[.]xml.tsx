import type { LoaderFunction } from "@remix-run/node";

const SITE_URL = "https://kuber.ee";

// Your language keys
const langs = ["eng", "rus", "est", "nor"] as const;

// Helper to build <url> blocks
const buildUrlEntry = (url: string) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

export const loader: LoaderFunction = () => {
  // Pages to include
  const basePages = [
    "/", // homepage
    "/modular-houses-estonia", // SEO page
  ];

  // Generate all language variants for each page:
  const urlEntries = basePages
    .flatMap((page) =>
      langs.map((lang) => {
        const url = `${SITE_URL}${page}?lang=${lang}`;
        return buildUrlEntry(url);
      })
    )
    .join("\n");

  // Full XML:
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
  >
    ${urlEntries}
  </urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Google-friendly caching
    },
  });
};
