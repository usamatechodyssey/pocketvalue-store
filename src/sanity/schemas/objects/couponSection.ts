import { defineField, defineType } from 'sanity'
import { Ticket } from 'lucide-react'

export default defineType({
  name: 'couponSection',
  title: 'Coupon Banner',
  type: 'object',
  icon: Ticket,
  fields: [
    defineField({
      name: 'couponReference',
      title: 'Select Coupon Banner',
      type: 'reference',
      to: [{ type: 'couponBanner' }], // Connects to your existing Coupon Documents
      description: 'Select a pre-made coupon design from the Coupons list.'
    }),
    defineField({
        name: 'fullWidth',
        title: 'Full Width Mode?',
        type: 'boolean',
        initialValue: false
    })
  ],
  preview: {
    select: { title: 'couponReference.title' },
    prepare({ title }) {
        return { title: title || 'Coupon Section', media: Ticket }
    }
  }
})