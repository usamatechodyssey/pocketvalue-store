import { defineField, defineType } from 'sanity'
import { Zap } from 'lucide-react'

export default defineType({
  name: 'dealSection',
  title: 'Deal / Campaign Section',
  type: 'object',
  icon: Zap,
  // Fieldsets help stabilize the layout
  fieldsets: [
    {name: 'config', title: 'Configuration'},
    {name: 'source', title: 'Data Source'},
    {name: 'design', title: 'Design & Layout'},
  ],
  fields: [
    // 1. HEADER INFO
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      fieldset: 'config', // Added to fieldset
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (Optional)',
      type: 'string',
      fieldset: 'config',
    }),

    // 2. THE BRAIN (FETCH STRATEGY)
    defineField({
      name: 'fetchStrategy',
      title: 'Product Source',
      type: 'string',
      fieldset: 'source', // Added to fieldset
      options: {
        list: [
          { title: 'Campaign (e.g. Eid Sale)', value: 'campaign' },
          { title: 'Category (e.g. Shoes)', value: 'category' },
          { title: 'Manual Selection', value: 'manual' },
          { title: 'Tag (New/Best/Featured)', value: 'tag' }
        ],
        layout: 'radio'
      },
      initialValue: 'campaign'
    }),

    // 3. CONDITIONAL FIELDS (STABILIZED)
    // Note: Keeping them in the same fieldset helps prevent layout jumps
    defineField({
        name: 'selectedCampaign',
        title: 'Select Campaign',
        type: 'reference',
        to: [{ type: 'campaign' }],
        fieldset: 'source',
        hidden: ({ parent }) => parent?.fetchStrategy !== 'campaign',
    }),
    defineField({
        name: 'selectedCategory',
        title: 'Select Category',
        type: 'reference',
        to: [{ type: 'category' }],
        fieldset: 'source',
        hidden: ({ parent }) => parent?.fetchStrategy !== 'category'
    }),
    defineField({
        name: 'manualProducts',
        title: 'Select Products Manually',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'product' }] }],
        fieldset: 'source',
        hidden: ({ parent }) => parent?.fetchStrategy !== 'manual'
    }),
    defineField({
        name: 'tagType',
        title: 'Select Tag',
        type: 'string',
        fieldset: 'source',
        options: {
            list: [
                { title: 'New Arrivals', value: 'newArrivals' },
                { title: 'Best Sellers', value: 'bestSellers' },
                { title: 'Featured Products', value: 'featured' }
            ]
        },
        hidden: ({ parent }) => parent?.fetchStrategy !== 'tag'
    }),

    // 4. DESIGN & LAYOUT
    defineField({
        name: 'viewType',
        title: 'Layout Style',
        type: 'string',
        fieldset: 'design',
        options: { list: [{ title: 'Slider', value: 'slider' }, { title: 'Grid', value: 'grid' }] },
        initialValue: 'slider'
    }),
    defineField({
        name: 'backgroundStyle',
        title: 'Background Style',
        type: 'string',
        fieldset: 'design',
        options: {
            list: [
                { title: 'Clean White', value: 'white' },
                { title: 'Vibrant Gradient', value: 'gradient' },
                { title: 'Light Gray', value: 'gray' }
            ]
        },
        initialValue: 'white'
    }),
    
    // Timer
    defineField({
        name: 'enableTimer',
        title: 'Show Countdown Timer?',
        type: 'boolean',
        fieldset: 'design',
        initialValue: false
    }),
    defineField({
        name: 'endTime',
        title: 'Deal End Time',
        type: 'datetime',
        fieldset: 'design',
        hidden: ({ parent }) => !parent?.enableTimer
    }),

    // Side Banner
    defineField({
        name: 'showSideBanner',
        title: 'Show Side Banner?',
        type: 'boolean',
        fieldset: 'design',
        initialValue: false,
    }),
    defineField({
        name: 'sideBanner',
        title: 'Side Banner Config',
        type: 'object',
        fieldset: 'design',
        hidden: ({parent}) => !parent?.showSideBanner,
        fields: [
            defineField({ name: 'image', title: 'Banner Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'link', title: 'Link', type: 'string' }),
        ]
    })
  ],
  preview: {
    select: { title: 'title', strategy: 'fetchStrategy', banner: 'showSideBanner' },
    prepare({ title, strategy, banner }) {
      return {
        title: title || 'Deal Section',
        subtitle: `${strategy?.toUpperCase()} | Banner: ${banner ? '✅' : '❌'}`,
        media: Zap
      }
    }
  }
})