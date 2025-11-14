// sanity/schemas/faq.ts

import {defineField, defineType} from 'sanity'
import {HelpCircle} from 'lucide-react'

export default defineType({
  name: 'faq',
  title: 'FAQ Page',
  type: 'document',
  icon: HelpCircle,
  groups: [ // <-- NEW: Added groups for organization
    { name: 'content', title: 'Q&A Content', default: true },
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      initialValue: 'Frequently Asked Questions',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'faqList',
      title: 'List of Questions & Answers',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'Q&A Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [{type: 'block'}],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        },
      ],
    }),

    // --- NEW: SEO Field ---
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo', // Reference to our reusable SEO schema
      group: 'seo',
    }),
  ],
})

// --- SUMMARY OF CHANGES ---
// - Added a `groups` array to create "Q&A Content" and "SEO Settings" tabs for better organization.
// - Moved the existing `title` and `faqList` fields into the "Content" group.
// - Added the reusable `seo` field and placed it in the new "SEO Settings" group, allowing for dynamic SEO control from the CMS.