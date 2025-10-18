import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productVariant',
  title: 'Product Variant',
  type: 'object',
  fields: [
    // --- GENERAL INFORMATION ---
    defineField({
      name: 'name',
      title: 'Variant Name',
      type: 'string',
      description: 'e.g., "Red / Large" or "Default" for simple products.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU (Stock Keeping Unit)',
      type: 'string',
      description: 'Optional: A unique code for this specific variant.',
    }),

    // --- PRICING & STOCK ---
    defineField({
      name: 'price',
      title: 'Price (PKR)',
      type: 'number',
      description: 'The price for this specific variant.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale Price (PKR)',
      type: 'number',
      description: 'Optional: Must be lower than the original price.',
      validation: (Rule) =>
        Rule.min(0).custom((salePrice, context) => {
          // 'context.parent' se hum اسی variant ke doosre fields access kar sakte hain
          const parent = context.parent as {price?: number}
          if (parent.price === undefined) {
            return true // Agar price set nahi to validation pass
          }
          if (salePrice && salePrice >= parent.price) {
            return 'Sale Price must be lower than the original Price.'
          }
          return true
        }),
    }),
   // Naya "Stock" field
    defineField({
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      description: 'Enter the exact number of items in stock. Leave empty to use the old "In Stock?" toggle.',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    
    // Purana "inStock" field ab optional hai
    defineField({
      name: 'inStock',
      title: 'In Stock?',
      type: 'boolean',
      description: 'Legacy field. Use "Stock Quantity" for new products.',
      initialValue: true,
    }),

    // --- MEDIA ---
    defineField({
      name: 'images',
      title: 'Variant-Specific Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description:
        'Optional: Upload images for this variant (e.g., pictures of the red shirt). If empty, the main product images will be used as a fallback.',
    }),

    // --- ATTRIBUTES ---
    defineField({
      name: 'attributes',
      title: 'Attributes',
      type: 'array',
      of: [{type: 'variantAttribute'}],
      description: 'e.g., Color: Red, Size: Large. Leave empty for simple/default products.',
    }),

    // --- SHIPPING DETAILS (Optional) ---
    defineField({
      name: 'weight',
      title: 'Weight (kg)',
      type: 'number',
      description: 'Optional: Weight of the product for shipping calculations.',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions (cm)',
      type: 'object',
      description: 'Optional: Dimensions of the package for shipping.',
      fields: [
        defineField({name: 'height', title: 'Height', type: 'number'}),
        defineField({name: 'width', title: 'Width', type: 'number'}),
        defineField({name: 'depth', title: 'Depth', type: 'number'}),
      ],
    }),
  ],
})