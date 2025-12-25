import { defineField, defineType } from 'sanity'
import { ShoppingBag } from 'lucide-react'

export default defineType({
  name: 'productShowcase',
  title: 'Product Showcase (Row)',
  type: 'object',
  icon: ShoppingBag,
  fields: [
    // 1. Header
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'e.g. New Arrivals, Best Sellers',
      validation: Rule => Rule.required()
    }),

    // 2. Data Source
    defineField({
        name: 'type',
        title: 'Product Source',
        type: 'string',
        options: {
            list: [
                { title: 'New Arrivals (Auto)', value: 'newest' },
                { title: 'Best Sellers (Auto)', value: 'best-selling' },
                { title: 'Featured Products (Auto)', value: 'featured' },
                { title: 'Manual Selection', value: 'manual' }
            ],
            layout: 'radio'
        },
        initialValue: 'newest'
    }),
    // Manual Selection Field (Hidden unless Manual is picked)
    defineField({
        name: 'manualProducts',
        title: 'Select Products',
        type: 'array',
        of: [{ type: 'reference', to: [{type: 'product'}] }],
        hidden: ({parent}) => parent?.type !== 'manual'
    }),

    // 3. SIDE BANNER MAGIC (Updated Requirement)
    defineField({
        name: 'showSideBanner',
        title: 'Add Side Banner?',
        type: 'boolean',
        initialValue: false,
        description: 'Enable this to show a banner on the left side of the product slider.'
    }),
    defineField({
        name: 'sideBanner',
        title: 'Side Banner Configuration',
        type: 'object',
        hidden: ({parent}) => !parent?.showSideBanner, // Chupa rahega agar disable hai
        fields: [
            defineField({ name: 'image', title: 'Banner Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'link', title: 'Banner Link', type: 'string' }),
        ]
    })
  ],
  preview: {
    select: { title: 'title', type: 'type', hasBanner: 'showSideBanner' },
    prepare({ title, type, hasBanner }) {
        return {
            title: title || 'Product Showcase',
            subtitle: `Source: ${type} | Banner: ${hasBanner ? '✅' : '❌'}`,
            media: ShoppingBag
        }
    }
  }
})