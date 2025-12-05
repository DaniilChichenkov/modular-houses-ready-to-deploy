import type { LoaderFunction } from "@remix-run/node";

const SITE_URL = "https://kuber.ee";

export const loader: LoaderFunction = () => {
  const content = `
User-agent: *
Allow: /

Disallow: /admin
Disallow: /api

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(content.trim(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
