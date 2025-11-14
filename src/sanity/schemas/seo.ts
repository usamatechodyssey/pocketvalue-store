// sanity/schemas/seo.ts

import { defineField, defineType } from 'sanity';

/**
 * A reusable SEO object schema for Sanity.
 * Includes fields for meta title, description, and social sharing image.
 */
export default defineType({
  name: 'seo',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'The title that appears in the browser tab and search engine results. Optimal length is 50-60 characters.',
      validation: Rule => Rule.max(60).warning('A title longer than 60 characters may be truncated.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'A brief summary of the page for search engine results. Optimal length is 150-160 characters.',
      validation: Rule => Rule.max(160).warning('A description longer than 160 characters may be truncated.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (Open Graph)',
      type: 'image',
      description: 'The image displayed when the page is shared on social media. Recommended size: 1200x630 pixels.',
      options: {
        hotspot: true,
      },
    }),
  ],
});