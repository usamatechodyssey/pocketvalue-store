import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export default defineType({
  name: 'brandSection',
  title: 'Brand Showcase',
  type: 'object',
  icon: Tag,
  fields: [
    defineField({
        name: 'title',
        title: 'Section Title',
        type: 'string',
        initialValue: 'Shop by Top Brands'
    }),
    defineField({
        name: 'manualBrands',
        title: 'Select Specific Brands (Optional)',
        description: 'If left empty, top 8 brands will be shown automatically.',
        type: 'array',
        of: [{ type: 'reference', to: [{type: 'brand'}] }]
    })
  ],
  preview: {
    prepare() { return { title: 'Brand Showcase', media: Tag } }
  }
})