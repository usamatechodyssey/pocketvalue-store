import { defineField, defineType } from 'sanity'
import { Grid } from 'lucide-react'

export default defineType({
  name: 'categoryGrid',
  title: 'Featured Category Grid',
  type: 'object',
  icon: Grid,
  fields: [
    defineField({
        name: 'title',
        title: 'Section Title',
        type: 'string',
        initialValue: 'Featured Collections'
    }),
    defineField({
        name: 'items',
        title: 'Grid Items',
        type: 'array',
        of: [{ type: 'featuredCategory' }] // Reusing your existing object
    })
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
        return {
            title: title,
            subtitle: 'Bento Grid Layout',
            media: Grid
        }
    }
  }
})