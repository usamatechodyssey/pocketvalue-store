// // sanity/schemas/product.ts

// import {defineType, defineField} from 'sanity'

// export default defineType({
//   name: 'product',
//   title: 'Product',
//   type: 'document',
//   groups: [ 
//     {name: 'main', title: 'Main Information', default: true},
//     {name: 'details', title: 'Details & Specifications'},
//     {name: 'marketing', title: 'Marketing & SEO'},
//   ],
//   fields: [
//     // --- MAIN INFORMATION ---
//     defineField({
//       name: 'title',
//       title: 'Product Title',
//       type: 'string',
//       group: 'main',
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: 'slug',
//       title: 'Slug',
//       type: 'slug',
//       options: {source: 'title'},
//       group: 'main',
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: 'videoUrl',
//       title: 'Product Video URL (Optional)',
//       type: 'url',
//       group: 'main',
//       description: 'Paste an optimized video URL from Cloudinary or YouTube.',
//     }),
//     defineField({
//       name: 'variants',
//       title: 'Product Variants',
//       type: 'array',
//       of: [{type: 'productVariant'}],
//       group: 'main',
//       validation: (Rule) => Rule.required().min(1).error('You must add at least one variant.'),
//     }),

//     // --- DETAILS & SPECIFICATIONS ---
//     defineField({
//       name: 'description',
//       title: 'Description',
//       type: 'array',
//       of: [{ type: 'block' }],
//       group: 'details',
//     }),
//     defineField({
//       name: 'categories',
//       title: 'Categories',
//       type: 'array',
//       of: [{type: 'reference', to: [{type: 'category'}]}],
//       group: 'details',
//       validation: (Rule) => Rule.required().min(1),
//     }),
//     defineField({
//       name: 'brand',
//       title: 'Brand',
//       type: 'reference',
//       to: [{type: 'brand'}],
//       group: 'details',
//     }),
//     defineField({
//       name: 'specifications',
//       title: 'Product Specifications',
//       type: 'array',
//       of: [{ type: 'object', fields: [ {name: 'label', type: 'string'}, {name: 'value', type: 'string'} ] }],
//       group: 'details',
//     }),
//     defineField({
//         name: 'shippingAndReturns',
//         title: 'Shipping & Returns Information',
//         type: 'array',
//         of: [{ type: 'block' }],
//         group: 'details',
//     }),

//     // --- MARKETING & SEO ---
//     defineField({
//         name: 'rating',
//         title: 'Initial Rating (1-5)',
//         type: 'number',
//         group: 'marketing',
//         description: 'Optional: Set an initial rating. This will be updated by user reviews.',
//         validation: Rule => Rule.min(1).max(5)
//     }),
//     defineField({name: 'isBestSeller', title: 'Mark as Best Seller', type: 'boolean', group: 'marketing', initialValue: false }),
//     defineField({name: 'isNewArrival', title: 'Mark as New Arrival', type: 'boolean', group: 'marketing', initialValue: false }),
//     defineField({name: 'isFeatured', title: 'Mark as Featured', type: 'boolean', group: 'marketing', initialValue: false }),
//     defineField({
//       name: 'isOnDeal',
//       title: "Show in 'Today's Deals'",
//       type: 'boolean',
//       group: 'marketing',
//       description: 'Turn this on to feature this product on the deals page.',
//       initialValue: false 
//     }),
    
//     // --- NEW: SEO Field ---
//     defineField({
//         name: 'seo',
//         title: 'SEO Settings',
//         type: 'seo', // Reference to our reusable SEO schema
//         group: 'marketing',
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

// // --- SUMMARY OF CHANGES ---
// // - Added a new `defineField` for 'seo' which references our reusable `seo` schema type.
// // - Placed the new SEO field within the existing 'marketing' group for organizational clarity in Sanity Studio.
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
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
    
    // 🔥 NEW: CAMPAIGN TAGGING (The Game Changer) 🔥
    defineField({
      name: 'activeCampaigns',
      title: 'Active Campaigns & Deals',
      description: 'Select active sales events this product belongs to (e.g. Flash Sale, Eid Deal).',
      type: 'array',
      group: 'marketing',
      of: [
        {
          type: 'reference',
          to: [{ type: 'campaign' }] // <-- Connects to our new Campaign Schema
        }
      ]
    }),

    // Legacy boolean flags (Inhein abhi rehne dein fallback ke liye)
    defineField({name: 'isBestSeller', title: 'Mark as Best Seller', type: 'boolean', group: 'marketing', initialValue: false }),
    defineField({name: 'isNewArrival', title: 'Mark as New Arrival', type: 'boolean', group: 'marketing', initialValue: false }),
    defineField({name: 'isFeatured', title: 'Mark as Featured', type: 'boolean', group: 'marketing', initialValue: false }),
    
    // Legacy Deal Switch (Hum future mein isay hatayenge)
    defineField({
      name: 'isOnDeal',
      title: "Show in 'Today's Deals' (Legacy)",
      type: 'boolean',
      group: 'marketing',
      initialValue: false 
    }),
    
    // SEO Field
    defineField({
        name: 'seo',
        title: 'SEO Settings',
        type: 'seo',
        group: 'marketing',
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