import {defineField, defineType} from 'sanity'
import {HelpCircle} from 'lucide-react'

export default defineType({
  name: 'faq',
  title: 'FAQ Page',
  type: 'document',
  icon: HelpCircle,
  // Note: Is schema ke liye __experimental_actions ki zaroorat nahi hai.
  // Sanity v3 mein, agar aap isko singleton banana chahte hain, to structure builder use karein.
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'faqList',
      title: 'List of Questions & Answers',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'Q&A Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array', // Rich text ke liye
              of: [{type: 'block'}],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        },
      ],
    }),
  ],
})