import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'variantAttribute',
  title: 'Variant Attribute',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Attribute Name',
      type: 'string',
      description: 'e.g., Size, Color, Material',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Attribute Value',
      type: 'string',
      description: 'e.g., Large, Red, Cotton',
      validation: (Rule) => Rule.required(),
    }),
  ],
})