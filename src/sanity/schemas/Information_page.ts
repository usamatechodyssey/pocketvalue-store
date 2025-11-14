// sanity/schemas/page.ts

import {defineField, defineType} from 'sanity'
import {FileText} from 'lucide-react'

export default defineType({
  name: 'page',
  title: 'Informational Page',
  type: 'document',
  icon: FileText,
  groups: [ // <-- NEW: Added groups for organization
    { name: 'content', title: 'Page Content', default: true },
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
      },
      group: 'content',
      description: 'e.g., "about-us", "terms-of-service". This will become the page URL.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Page Content',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // --- NEW: SEO Field ---
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo', // Reference to our reusable SEO schema
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: title,
        subtitle: slug ? `/${slug}` : 'No slug yet',
      }
    },
  },
})

// --- SUMMARY OF CHANGES ---
// - Added a `groups` array to create "Page Content" and "SEO Settings" tabs in the Sanity Studio UI.
// - Moved all existing fields into the "Page Content" group.
// - Added a new `defineField` for 'seo' and placed it in the new "SEO Settings" group.