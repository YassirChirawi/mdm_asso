import { MetadataRoute } from 'next';
import { chapters } from '@/data/chapters';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.marocainsenfrance.fr';
  const lastModified = new Date();

  // Base pages
  const routes = ['', '/about', '/guide', '/contact', '/mentions-legales'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  // Guide chapters
  const guideRoutes = chapters.map((chapter) => ({
    url: `${baseUrl}/guide/${chapter.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...guideRoutes];
}
