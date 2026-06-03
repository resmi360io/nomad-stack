import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== 'production') {
    return {
      rules: { userAgent: '*', disallow: '/' },
      sitemap: 'https://paidacross.com/sitemap.xml',
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://paidacross.com/sitemap.xml',
  };
}
