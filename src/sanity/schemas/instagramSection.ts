// sanity/schemas/instagramFeed.ts
import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons' // Using a generic icon instead

export default defineType({
  name: 'instagramFeed',
  title: 'Homepage Instagram Feed',
  type: 'document',
  icon: ImagesIcon, // Using a valid, generic icon
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Instagram Feed Settings',
      hidden: true,
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Join the #PocketValueFamily',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Section Subheading',
      type: 'string',
      initialValue: 'Follow us on Instagram for updates, offers, and more!',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Your Instagram Handle',
      description: 'Just the handle, without the @ (e.g., pocketvalue.pk)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      description: 'Manually upload 6-8 of your best Instagram-style images.',
      type: 'array',
      of: [
        {
          name: 'galleryImage',
          title: 'Gallery Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility.',
              validation: (Rule) => Rule.required(),
            }
          ]
        }
      ],
      validation: (Rule) => Rule.min(4).max(8).error('Please add between 4 and 8 images.'),
    })
  ],
})