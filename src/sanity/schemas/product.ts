// import {defineType, defineField} from 'sanity'

// export default defineType({
//   name: 'product',
//   title: 'Product',
//   type: 'document',
//   fields: [
//     // --- PRODUCT IDENTIFICATION ---
//     defineField({
//       name: 'title',
//       title: 'Product Title',
//       type: 'string',
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: 'slug',
//       title: 'Slug',
//       type: 'slug',
//       options: {source: 'title'},
//       validation: (Rule) => Rule.required(),
//     }),
//      // === YAHAN NAYA FIELD ADD HUA HAI ===
//     defineField({
//       name: 'videoUrl',
//       title: 'Product Video URL (Optional)',
//       type: 'url',
//       description: 'Paste an optimized video URL from Cloudinary or YouTube.',
//     }),
//     // =
//     // --- VARIANTS (THE CORE) ---
//     defineField({
//       name: 'variants',
//       title: 'Product Variants',
//       type: 'array',
//       of: [{type: 'productVariant'}],
//       validation: (Rule) => Rule.required().min(1).error('You must add at least one variant.'),
//     }),

//     // --- COMMON DETAILS ---
//     defineField({
//       name: 'description',
//       title: 'Description',
//       type: 'array',
//       of: [{ type: 'block' }],
//     }),
//     // === NAYA FIELD WAPIS ADD KIYA GAYA HAI ===
//     defineField({
//         name: 'rating',
//         title: 'Initial Rating (1-5)',
//         type: 'number',
//         description: 'Optional: Set an initial rating for the product. This will be updated as users leave reviews.',
//         validation: Rule => Rule.min(1).max(5)
//     }),
//     // ===========================================
//     defineField({
//       name: 'categories',
//       title: 'Categories',
//       type: 'array',
//       of: [{type: 'reference', to: [{type: 'category'}]}],
//       validation: (Rule) => Rule.required().min(1),
//     }),
//     defineField({
//       name: 'brand',
//       title: 'Brand',
//       type: 'reference',
//       to: [{type: 'brand'}],
//     }),
//     defineField({
//       name: 'specifications',
//       title: 'Product Specifications',
//       type: 'array',
//       of: [{ type: 'object', fields: [ {name: 'label', type: 'string'}, {name: 'value', type: 'string'} ] }],
//     }),
//     defineField({
//         name: 'shippingAndReturns',
//         title: 'Shipping & Returns Information',
//         type: 'array',
//         of: [{ type: 'block' }]
//     }),

//     // --- MARKETING & TAGS ---
//     defineField({name: 'isBestSeller', title: 'Mark as Best Seller', type: 'boolean', initialValue: false }),
//     defineField({name: 'isNewArrival', title: 'Mark as New Arrival', type: 'boolean', initialValue: false }),
//     defineField({name: 'isFeatured', title: 'Mark as Featured', type: 'boolean', initialValue: false }),
//     defineField({
//       name: 'isOnDeal',
//       title: "Show in 'Today's Deals'",
//       type: 'boolean',
//       group: 'marketing',
//       description: 'Turn this on to feature this product on the deals page.',
//       initialValue: false 
//     }),
//   ],
//   preview: {
//     select: {
//       title: 'title',
//       variants: 'variants',
//     },
//     prepare({title, variants}) {
//       const firstVariant = variants?.[0];
//       const image = firstVariant?.images?.[0];
//       const variantCount = variants?.length || 0;
//       return {
//         title: title,
//         subtitle: `${variantCount} variant(s). Price: ${firstVariant?.price ? `Rs. ${firstVariant.price}` : 'N/A'}`,
//         media: image || undefined,
//       }
//     },
//   },
// })
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  // Fields ko group karna taake Sanity Studio mein UI saaf lage
  groups: [ 
    {name: 'main', title: 'Main Information', default: true},
    {name: 'details', title: 'Details & Specifications'},
    {name: 'marketing', title: 'Marketing & SEO'},
  ],
  fields: [
    // --- MAIN INFORMATION ---
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Product Video URL (Optional)',
      type: 'url',
      group: 'main',
      description: 'Paste an optimized video URL from Cloudinary or YouTube.',
    }),
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      of: [{type: 'productVariant'}],
      group: 'main',
      validation: (Rule) => Rule.required().min(1).error('You must add at least one variant.'),
    }),

    // --- DETAILS & SPECIFICATIONS ---
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'details',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      group: 'details',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{type: 'brand'}],
      group: 'details',
    }),
    defineField({
      name: 'specifications',
      title: 'Product Specifications',
      type: 'array',
      of: [{ type: 'object', fields: [ {name: 'label', type: 'string'}, {name: 'value', type: 'string'} ] }],
      group: 'details',
    }),
    defineField({
        name: 'shippingAndReturns',
        title: 'Shipping & Returns Information',
        type: 'array',
        of: [{ type: 'block' }],
        group: 'details',
    }),

    // --- MARKETING & SEO ---
    defineField({
        name: 'rating',
        title: 'Initial Rating (1-5)',
        type: 'number',
        group: 'marketing',
        description: 'Optional: Set an initial rating. This will be updated by user reviews.',
        validation: Rule => Rule.min(1).max(5)
    }),
    defineField({name: 'isBestSeller', title: 'Mark as Best Seller', type: 'boolean', group: 'marketing', initialValue: false }),
    defineField({name: 'isNewArrival', title: 'Mark as New Arrival', type: 'boolean', group: 'marketing', initialValue: false }),
    defineField({name: 'isFeatured', title: 'Mark as Featured', type: 'boolean', group: 'marketing', initialValue: false }),
    
    // === NAYA FIELD YAHAN ADD HUA HAI ===
    defineField({
      name: 'isOnDeal',
      title: "Show in 'Today\'s Deals'",
      type: 'boolean',
      group: 'marketing',
      description: 'Turn this on to feature this product on the deals page.',
      initialValue: false 
    }),
  ],
  preview: {
    select: {
      title: 'title',
      variants: 'variants',
    },
    prepare({title, variants}) {
      const firstVariant = variants?.[0];
      const image = firstVariant?.images?.[0];
      const variantCount = variants?.length || 0;
      return {
        title: title,
        subtitle: `${variantCount} variant(s). Price: ${firstVariant?.price ? `Rs. ${firstVariant.price}` : 'N/A'}`,
        media: image || undefined,
      }
    },
  },
})