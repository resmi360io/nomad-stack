import type { MetadataRoute } from 'next';
import { CORRIDORS } from '@/data/corridors';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paidacross.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const corridorPages: MetadataRoute.Sitemap = CORRIDORS.map((c) => ({
    url: `${SITE_URL}/receive/${c.slug}`,
    lastModified: new Date(c.updatedDate),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/receive-international-payments`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/how-we-make-money`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/about/author`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...corridorPages,
  ];
}
