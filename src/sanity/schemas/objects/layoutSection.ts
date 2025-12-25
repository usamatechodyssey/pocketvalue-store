import { defineField, defineType } from 'sanity'
import { ShieldCheck } from 'lucide-react'

export default defineType({
  name: 'layoutSection',
  title: 'Layout Block',
  type: 'object',
  icon: ShieldCheck,
  fields: [
    defineField({
        name: 'type',
        title: 'Section Type',
        type: 'string',
        options: {
            list: [
                { title: 'Trust Bar (Icons)', value: 'trust' },
                { title: 'Newsletter Signup', value: 'newsletter' },
                { title: 'Infinite Product Grid', value: 'infiniteGrid' }
            ],
            layout: 'radio'
        },
        initialValue: 'trust'
    }),
    // Settings for Infinite Grid
    defineField({
        name: 'gridTitle',
        title: 'Grid Title',
        type: 'string',
        hidden: ({parent}) => parent?.type !== 'infiniteGrid',
        initialValue: 'More to Explore'
    })
  ],
  preview: {
    select: { type: 'type' },
    prepare({ type }) {
        return { 
            title: type === 'trust' ? 'Trust Badges' : type === 'newsletter' ? 'Newsletter' : 'Infinite Products',
            media: ShieldCheck 
        }
    }
  }
})