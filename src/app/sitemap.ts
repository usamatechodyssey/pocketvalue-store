// /src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import groq from 'groq';

interface SitemapEntry {
  slug: string;
  _updatedAt: string;
}

/**
 * Dynamically generates the sitemap.xml file.
 * This function fetches all public document types (products, categories, posts)
 * from Sanity and constructs a sitemap compliant with the sitemap protocol.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL environment variable. It's required for a production sitemap.");
  }

  // Define GROQ queries to fetch only the necessary fields for the sitemap.
  const productsQuery: Promise<SitemapEntry[]> = client.fetch(groq`*[_type == "product" && defined(slug.current)]{"slug": slug.current, _updatedAt}`);
  const categoriesQuery: Promise<SitemapEntry[]> = client.fetch(groq`*[_type == "category" && defined(slug.current)]{"slug": slug.current, _updatedAt}`);
  const postsQuery: Promise<SitemapEntry[]> = client.fetch(groq`*[_type == "post" && defined(slug.current)]{"slug": slug.current, _updatedAt}`);
  
  // Fetch all data concurrently for better performance.
  const [products, categories, posts] = await Promise.all([productsQuery, categoriesQuery, postsQuery]);

  // Map the fetched data into the sitemap URL format.
  const productUrls = products.map(product => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.8,
  }));

  const categoryUrls = categories.map(category => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }));

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.6,
  }));

  // Combine all URLs, starting with the static homepage.
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...productUrls,
    ...categoryUrls,
    ...postUrls,
  ];
}