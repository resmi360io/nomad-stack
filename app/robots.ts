import type { MetadataRoute } from 'next';

const SITEMAP_URL = 'https://paidacross.com/sitemap.xml';

export default function robots(): MetadataRoute.Robots {
  // Block crawlers only on Vercel preview deployments.
  // When VERCEL_ENV is undefined (local dev) we allow crawling so the sitemap
  // can be tested; Vercel sets VERCEL_ENV='preview' on non-production deploys.
  if (process.env.VERCEL_ENV === 'preview') {
    return {
      rules: { userAgent: '*', disallow: '/' },
      sitemap: SITEMAP_URL,
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: SITEMAP_URL,
  };
}
