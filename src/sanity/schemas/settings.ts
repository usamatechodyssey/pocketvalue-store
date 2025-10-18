import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // Is se sirf ek hi settings document banega
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Site Settings',
      readOnly: true, // User isay change na kar sake
      hidden: true, // UI mein nazar na aye
    }),
    defineField({
      name: 'searchSettings',
      title: 'Search Suggestions',
      type: 'object',
      description: 'These suggestions will appear in the search panel on mobile and in the search dropdown on desktop.',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'trendingKeywords',
          title: 'Trending Keywords',
          type: 'array',
          description: 'Enter keywords that are currently popular (e.g., "lawn suits", "sneakers for men").',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          }
        }),
        defineField({
          name: 'popularCategories',
          title: 'Popular Categories',
          type: 'array',
          description: 'Select a few categories to highlight in the search panel.',
          of: [
            {
              type: 'reference',
              to: [{ type: 'category' }],
            },
          ],
          validation: (Rule) => Rule.max(6).error('You can select a maximum of 6 categories.'),
        }),
      ],
    }),
  ],
})