// src/sanity/schemas/review.ts - UPDATED
import {defineField, defineType} from 'sanity'
import {Star} from 'lucide-react'

export default defineType({
  name: 'review',
  title: 'Product Review',
  type: 'document',
  icon: Star,
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'object',
      // NAYA: 'image' field add kiya hai
      fields: [
        {name: 'id', title: 'User ID', type: 'string'},
        {name: 'name', title: 'User Name', type: 'string'},
        {name: 'image', title: 'User Profile Image', type: 'url'}, // User ki profile image ka URL
      ],
      validation: Rule => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: Rule => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      validation: Rule => Rule.required().min(10).max(1000),
    }),
    // NAYA: Yeh poora field naya hai review ke saath image dene ke liye
    defineField({
      name: 'reviewImage',
      title: 'Review Image',
      type: 'image', // Hum Sanity ki 'image' type use karenge
      options: {
        hotspot: true, // Yeh image ko focus karne mein madad deta hai
      },
      description: 'User can optionally upload an image with their review.',
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved',
      type: 'boolean',
      description: 'Reviews will not be shown on the site until approved.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      userName: 'user.name',
      productTitle: 'product.title',
      rating: 'rating',
      comment: 'comment',
      media: 'reviewImage', // NAYA: Preview mein image dikhayein
    },
    prepare(selection) {
      const {userName, productTitle, rating, comment, media} = selection
      return {
        title: `${userName} on ${productTitle}`,
        subtitle: `Rating: ${rating} ★ - "${comment.substring(0, 40)}..."`,
        media: media || Star, // Agar review image hai to woh, warna Star icon
      }
    },
  },
})