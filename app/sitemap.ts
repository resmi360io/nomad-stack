import type { MetadataRoute } from 'next';
import { CORRIDORS } from '@/data/corridors';
import { RATE_PAGES } from '@/data/ratePages';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paidacross.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const corridorPages: MetadataRoute.Sitemap = CORRIDORS.map((c) => ({
    url: `${SITE_URL}/receive/${c.slug}`,
    lastModified: new Date(c.updatedDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Provider rate pages. Priority sits just under the corridor pages: they target a narrower,
  // more transactional query and they link UP to the corridor page rather than competing with it.
  const ratePages: MetadataRoute.Sitemap = RATE_PAGES.map((p) => ({
    url: `${SITE_URL}/rates/${p.slug}`,
    lastModified: new Date(p.updatedDate),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/receive-international-payments`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/how-we-make-money`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/about/author`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...corridorPages,
    ...ratePages,
  ];
}
