import {defineField, defineType} from 'sanity'
import {Flame} from 'lucide-react'

export default defineType({
  name: 'flashSale',
  title: 'Flash Sale Setup',
  type: 'document',
  icon: Flame,
  fields: [
    defineField({
      name: 'title',
      title: 'Sale Title',
      type: 'string',
      initialValue: 'Flash Sale',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isEnabled',
      title: 'Enable Flash Sale Section',
      type: 'boolean',
      description: 'Toggle this to show or hide the Flash Sale section on the homepage.',
      initialValue: true,
    }),
    defineField({
      name: 'endDate',
      title: 'Sale End Date & Time',
      type: 'datetime',
      description: 'Set the exact date and time when the sale will end.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Sale Products',
      type: 'array',
      description: 'Select the products to feature in the Flash Sale.',
      of: [
        {
          type: 'reference',
          to: [{type: 'product'}],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})