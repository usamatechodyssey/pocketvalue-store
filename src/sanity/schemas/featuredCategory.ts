// sanity/schemas/featuredCategory.ts - A NEW HELPER SCHEMA

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'featuredCategory',
  title: 'Featured Category',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discountText',
      title: 'Discount Text',
      type: 'string',
      description: 'e.g., "50-80% OFF" or "Under Rs. 999"',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'category.name',
      subtitle: 'discountText',
      media: 'category.image',
    },
  },
})