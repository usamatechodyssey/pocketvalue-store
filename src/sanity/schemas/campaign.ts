import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'campaign',
  title: 'Campaigns & Sales',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign Title',
      type: 'string',
      description: 'E.g., "Flash Sale", "Eid Mega Deal", "Winter Clearance"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'This will be used for the deal page URL (e.g., /deals/winter-clearance)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short description of the campaign (Internal use or SEO).',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active?',
      type: 'boolean',
      initialValue: true,
      description: 'Turn this off to hide this campaign globally without deleting it.',
    }),
    // Optional: Automated Scheduling
    defineField({
      name: 'startDate',
      title: 'Start Date (Optional)',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date (Optional)',
      type: 'datetime',
    }),
    // Visuals for the Campaign Page (Future Proofing)
    defineField({
      name: 'banner',
      title: 'Campaign Banner',
      type: 'image',
      options: { hotspot: true },
      description: 'Banner image displayed on the specific /deals/[slug] page.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
    },
    prepare({ title, isActive }) {
      return {
        title: title,
        subtitle: isActive ? '🟢 Active' : '🔴 Inactive',
        media: TagIcon,
      }
    },
  },
})