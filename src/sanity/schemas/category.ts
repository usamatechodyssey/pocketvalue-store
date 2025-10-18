// sanity/schemas/category.ts
import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    // Purane fields wese hi
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category Icon/Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),

    // === NAYE, SEPARATE BANNER FIELDS ===
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
        description: 'A short description for this category (for SEO).',
        type: 'text',
        group: 'pageContent',
    }),
  ],
  groups: [{ name: 'pageContent', title: 'Category Page Content' }],
  // ... (aapka preview wesa hi rahega)
})