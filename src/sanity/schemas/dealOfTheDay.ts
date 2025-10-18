// schemas/dealOfTheDay.ts

import {defineField, defineType} from 'sanity'
import {Flame} from 'lucide-react' // Acha sa icon

export default defineType({
  name: 'dealOfTheDay',
  title: 'Deal of the Day',
  type: 'document',
  icon: Flame,
  fields: [
    defineField({
      name: 'isEnabled',
      title: 'Enable Deal of the Day Section',
      type: 'boolean',
      description: 'Is switch ko on karein taake yeh section homepage par nazar aaye.',
      initialValue: true,
    }),
    defineField({
      name: 'product',
      title: 'Select Product for the Deal',
      type: 'reference',
      to: [{type: 'product'}], // Yeh aapke 'product' schema se link hoga
      description: 'Woh product chunein jisay aap deal mein dikhana chahte hain.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Custom Title (Optional)',
      type: 'string',
      description: 'Agar aap product ke naam se alag title dikhana chahte hain to yahan likhein. Warna khali chhor dein.',
    }),
    defineField({
      name: 'dealStartDate',
      title: 'Deal Start Date & Time',
      type: 'datetime',
      description: 'Deal is waqt par shuru hogi. Agar khali chhor dein to foran shuru hojayegi.',
      // Yeh ab required nahi hai, optional hai
    }),
    defineField({
      name: 'dealEndDate',
      title: 'Deal End Date & Time',
      type: 'datetime',
      description: 'Deal is waqt par khatam hojayegi.',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    }),
  ],
  preview: {
    select: {
      title: 'product.title',
      isEnabled: 'isEnabled'
    },
    prepare({title, isEnabled}) {
        return {
            title: title || 'Deal of the Day Setup',
            subtitle: isEnabled ? 'Section is ENABLED' : 'Section is DISABLED'
        }
    }
  }
})