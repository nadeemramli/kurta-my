import { MetadataRoute } from 'next';
import { baseUrl } from '@kurta-my/utils';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  // TODO: Add dynamic routes for products, collections, and pages
  // For now, we'll just return the static routes
  return routesMap;
} 