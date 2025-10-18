// sanity/schemas/lifestyleBanner.ts (THE FINAL CORRECTED VERSION)

import {defineField, defineType} from 'sanity'
import {PresentationIcon} from 'lucide-react'

export default defineType({
  name: 'lifestyleBanner',
  title: 'Lifestyle Banner',
  type: 'document',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: { list: [{title: 'Image', value: 'image'}, {title: 'Video', value: 'video'}], layout: 'radio' },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'desktopImage',
      title: 'Desktop Image',
      type: 'image',
      description: 'Also used as a fallback poster for videos.',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      type: 'image',
      description: 'Also used as a fallback poster for videos.',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaType !== 'image',
    }),

    // --- VIDEO OPTIONS (Dono ab maujood hain) ---
    
    // Option 1: Direct Upload
    defineField({
      name: 'desktopVideoFile',
      title: 'Desktop Video (Direct Upload)',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.mediaType !== 'video',
      description: 'Upload video directly to Sanity (for small, temporary files).',
    }),
    defineField({
      name: 'mobileVideoFile',
      title: 'Mobile Video (Direct Upload)',
      type: 'file',
      options: {accept: 'video/*'},
      hidden: ({parent}) => parent?.mediaType !== 'video',
    }),

    // Option 2: External URL (Cloudinary) - YEH FIELDS MISSING THE
    defineField({
      name: 'desktopVideoUrl',
      title: 'Desktop Video URL (Recommended)',
      type: 'url',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      description: 'Paste optimized video URL from Cloudinary or another CDN for best performance.',
    }),
    defineField({
      name: 'mobileVideoUrl',
      title: 'Mobile Video URL (Recommended)',
      type: 'url',
      hidden: ({parent}) => parent?.mediaType !== 'video',
    }),
  ],
  // Preview
  preview: {
    select: {
      title: 'title',
      mediaType: 'mediaType',
      desktopImage: 'desktopImage',
    },
    prepare({title, mediaType, desktopImage}) {
      return {
        title: title,
        subtitle: `Type: ${mediaType?.charAt(0).toUpperCase() + mediaType?.slice(1)}`,
        media: mediaType === 'image' ? desktopImage : PresentationIcon,
      }
    },
  },
})