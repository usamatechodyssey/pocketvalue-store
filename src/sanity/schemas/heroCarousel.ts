import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroCarousel',
  title: 'Hero Carousel Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title (e.g., NEW ARRIVALS)',
      type: 'string',
      description: 'Yeh title banner ke upar bari heading mein nazar aayega.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Yeh title ke neeche choti line mein nazar aayega.',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Button ke upar likha hua text (e.g., Shop Now).',
      initialValue: 'Shop Now',
    }),
    // === YAHAN ASAL CHANGE HAI ===
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Internal links ke liye "/slug" aur external ke liye poora URL daalein.',
      validation: Rule =>
        Rule.uri({
          // allowRelative: true ka matlab hai ki "/category/sale" jaisa link bhi valid hai
          allowRelative: true, 
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    // =============================

    defineField({
      name: 'desktopImage',
      title: 'Desktop Banner Image',
      type: 'image',
      description: 'Yeh barri screens (desktops, laptops) ke liye hai. Recommended Size: 1920x600 pixels.',
      options: {
        hotspot: true, // Zaroori hai taaki image sahi se crop ho
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Banner Image',
      type: 'image',
      description: 'Yeh choti screens (mobile) ke liye hai. Recommended Size: 750x900 pixels.',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'desktopImage',
    },
  },
})