// schemas/couponBanner.ts

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'couponBanner',
  title: 'Coupon Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      description: 'Sirf Sanity mein pehchanne ke liye (e.g., "Ramadan Offer Banner").',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link (Optional)',
      description: 'Is banner par click karke user kahan jayega?',
      type: 'reference',
      to: [{type: 'product'}, {type: 'category'}],
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {list: [{title: 'Image', value: 'image'}, {title: 'Video', value: 'video'}]},
      initialValue: 'image',
    }),
    defineField({
      name: 'mediaUrls',
      title: 'Media Files',
      type: 'object',
      fields: [
        defineField({name: 'mobile', title: 'Mobile Image/Video', type: 'file'}),
        defineField({name: 'tablet', title: 'Tablet Image/Video', type: 'file'}),
        defineField({name: 'desktop', title: 'Desktop Image/Video', type: 'file'}),
      ],
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'object',
      fields: [
        defineField({name: 'mobile', title: 'Mobile', type: 'string', initialValue: '100%'}),
        defineField({name: 'tablet', title: 'Tablet', type: 'string', initialValue: '700px'}),
        defineField({name: 'desktop', title: 'Desktop', type: 'string', initialValue: '1325px'}),
      ],
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'object',
      fields: [
        defineField({name: 'mobile', title: 'Mobile', type: 'string', initialValue: '250px'}),
        defineField({name: 'tablet', title: 'Tablet', type: 'string', initialValue: '180px'}),
        defineField({name: 'desktop', title: 'Desktop', type: 'string', initialValue: '140px'}),
      ],
    }),
    defineField({
      name: 'objectFit',
      title: 'Image Fit',
      type: 'string',
      options: {list: [{title: 'Cover', value: 'cover'}, {title: 'Contain', value: 'contain'}]},
      initialValue: 'contain',
    }),
    defineField({name: 'altText', title: 'Alt Text', type: 'string'}),
  ],
})