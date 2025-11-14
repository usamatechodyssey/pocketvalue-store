// sanity/schemas/category.ts

import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'main', title: 'Main Details', default: true },
    { name: 'pageContent', title: 'Category Page Content' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category Icon/Image',
      type: 'image',
      options: { hotspot: true },
      group: 'main',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'main',
    }),

    // --- CATEGORY PAGE CONTENT ---
    defineField({
      name: 'desktopBanner',
      title: 'Desktop Banner Image',
      description: 'Upload a wide (e.g., 1500x400) image for desktop screens.',
      type: 'image',
      options: { hotspot: true },
      group: 'pageContent',
    }),
    defineField({
      name: 'mobileBanner',
      title: 'Mobile Banner Image',
      description: 'Upload a tall/square (e.g., 800x1000) image for mobile screens.',
      type: 'image',
      options: { hotspot: true },
      group: 'pageContent',
    }),
    defineField({
        name: 'description',
        title: 'Category Description',
        description: 'A short description for this category, used on the page and for SEO.',
        type: 'text', // Changed to text for simpler, non-rich-text descriptions
        group: 'pageContent',
    }),
    
    // --- NEW: SEO Field ---
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo', // Reference to our reusable SEO schema
      group: 'pageContent',
    }),
  ],
})

// --- SUMMARY OF CHANGES ---
// - Added `groups` to the schema definition for better organization in the Sanity Studio UI.
// - Added a new `defineField` for 'seo' which references our reusable `seo` schema type.
// - Placed the SEO field within the 'pageContent' group.
// - Changed the `description` field from Portable Text to a simple `text` field, as rich text is not needed for a meta description fallback.