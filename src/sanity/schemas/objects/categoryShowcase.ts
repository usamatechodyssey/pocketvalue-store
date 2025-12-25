import { defineField, defineType } from 'sanity'
import { CircleDot } from 'lucide-react'

export default defineType({
  name: 'categoryShowcase',
  title: 'Category Carousel',
  type: 'object',
  icon: CircleDot,
  fields: [
    defineField({
        name: 'title',
        title: 'Section Title',
        type: 'string',
        initialValue: 'Shop by Category',
        validation: Rule => Rule.required() // Added validation
    }),
    defineField({
        name: 'categories',
        title: 'Select Categories',
        description: 'Choose at least 3 categories to display in the carousel.',
        type: 'array',
        of: [{ type: 'reference', to: [{type: 'category'}] }],
        validation: Rule => Rule.required().min(3).error('Please select at least 3 categories.')
    })
  ],
  preview: {
    select: {
      title: 'title',
      categories: 'categories'
    },
    prepare({ title, categories }) {
        const count = categories ? Object.keys(categories).length : 0;
        return {
            title: title || 'Category Carousel',
            subtitle: `${count} Categories Selected`,
            media: CircleDot
        }
    }
  }
})