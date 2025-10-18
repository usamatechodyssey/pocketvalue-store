// sanity/schemas/promoBanner.ts
import { defineField, defineType } from 'sanity'
import { PresentationIcon } from '@sanity/icons'

export default defineType({
  name: 'promoBanner',
  title: 'Promo / Story Banners',
  type: 'document',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      description: 'e.g., "For the Modern Home"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'The category or page this banner should link to (e.g., /category/home-decor)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'buttonText',
        title: 'Button Text',
        type: 'string',
        initialValue: 'Shop Now',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})