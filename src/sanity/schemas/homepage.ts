// // sanity-project/schemas/homepage.ts
// import {defineField, defineType} from 'sanity'

// export default defineType({
//   name: 'homepage',
//   title: 'Homepage Setup',
//   type: 'document',
//   fields: [
//     defineField({name: 'title', title: 'Title', type: 'string', initialValue: 'Homepage Configuration', readOnly: true}),
//     defineField({name: 'featuredProductsTitle', title: 'Featured Products Section Title', type: 'string', initialValue: 'Featured Products'}),
//     defineField({name: 'featuredProducts', title: 'Featured Products', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}]}),

    
//     defineField({
//       name: 'featuredCategoriesTitle', 
//       title: 'Featured Categories Carousel Title', 
//       type: 'string',
//     }),
//     defineField({
//       name: 'featuredCategories', 
//       title: 'Featured Categories (For Carousel)', 
//       description: 'Select categories for the small, scrolling carousel at the top of the page.',
//       type: 'array', 
//       of: [{type: 'reference', to: [{type: 'category'}]}]
//     }),
    
//     // === YAHAN NAYA, MYNTRA-STYLE GRID SECTION SHURU HOTA HAI ===
//     defineField({
//       name: 'categoryGridTitle',
//       title: 'Category Grid Section Title',
//       type: 'string',
//       initialValue: 'SHOP BY CATEGORY'
//     }),
//     defineField({
//       name: 'categoryGrid',
//       title: 'Category Grid (Myntra-Style)',
//       description: 'Select categories and add custom discount text for the large grid on the homepage.',
//       type: 'array',
//       // Hum yahan apni nayi 'featuredCategory' type istemal kar rahe hain
//       of: [{type: 'featuredCategory'}], 
//     }),

//        // === YAHAN SE NAYA CODE ADD KAREIN ===
//     defineField({
//       name: 'sectionBanners',
//       title: 'Product Section Banners',
//       description: 'Yahan har product section (New Arrivals, etc.) ke liye banner set karein.',
//       type: 'array',
//       of: [{
//         type: 'object',
//         fields: [
//           defineField({
//             name: 'tag',
//             title: 'Section Tag',
//             type: 'string',
//             options: {
//               list: [
//                 { title: 'New Arrivals', value: 'new-arrivals' },
//                 { title: 'Best Sellers', value: 'best-sellers' },
//                 { title: 'Featured Products', value: 'featured-products' },
//               ],
//               layout: 'radio'
//             },
//             validation: Rule => Rule.required()
//           }),
//           defineField({
//             name: 'bannerImage',
//             title: 'Banner Image',
//             type: 'image',
//             options: { hotspot: true },
//             validation: Rule => Rule.required()
//           }),
//           defineField({
//             name: 'link',
//             title: 'Link (Optional)',
//             description: 'Banner par click karke user kahan jayega?',
//             type: 'string'
//           })
//         ]
//       }]
//     }),
//   ],
// })

import { defineField, defineType } from 'sanity'
import { Home, Layers, Archive } from 'lucide-react'

export default defineType({
  name: 'homepage',
  title: 'Homepage Setup',
  type: 'document',
  icon: Home,
  groups: [
    { name: 'builder', title: 'Page Builder (New)', default: true, icon: Layers },
    { name: 'legacy', title: 'Legacy / Old Settings', icon: Archive },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Homepage Configuration',
      readOnly: true,
      group: 'builder'
    }),

    // 🔥 THE COMPLETE PAGE BUILDER ARRAY 🔥
    defineField({
      name: 'pageSections',
      title: 'Page Builder Sections',
      description: 'Build your homepage by stacking these blocks.',
      type: 'array',
      group: 'builder',
      of: [
        { type: 'bannerSection' },      // Banners
        { type: 'dealSection' },        // Flash Sales
        { type: 'productShowcase' },    // New Arrivals + Side Banner
        { type: 'categoryShowcase' },   // Circular Slider
        { type: 'categoryGrid' },       // Bento Grid
         { type: 'couponSection' },
        { type: 'brandSection' },
        { type: 'layoutSection' }, // Handles Trust, Newsletter, Infinite Grid
      ],
   
    }),

    // ============================================================
    // ⚠️ LEGACY FIELDS (PRESERVED FOR BACKWARD COMPATIBILITY)
    // ============================================================
    
    // --- Featured Products ---
    defineField({
        name: 'featuredProductsTitle', 
        title: 'Featured Products Section Title', 
        type: 'string', 
        initialValue: 'Featured Products',
        group: 'legacy'
    }),
    defineField({
        name: 'featuredProducts', 
        title: 'Featured Products', 
        type: 'array', 
        of: [{type: 'reference', to: [{type: 'product'}]}],
        group: 'legacy'
    }),

    // --- Featured Categories (Carousel) ---
    defineField({
      name: 'featuredCategoriesTitle', 
      title: 'Featured Categories Carousel Title', 
      type: 'string',
      group: 'legacy'
    }),
    defineField({
      name: 'featuredCategories', 
      title: 'Featured Categories (For Carousel)', 
      description: 'Select categories for the small, scrolling carousel at the top of the page.',
      type: 'array', 
      of: [{type: 'reference', to: [{type: 'category'}]}],
      group: 'legacy'
    }),
    
    // --- Category Grid (Myntra Style) ---
    defineField({
      name: 'categoryGridTitle',
      title: 'Category Grid Section Title',
      type: 'string',
      initialValue: 'SHOP BY CATEGORY',
      group: 'legacy'
    }),
    defineField({
      name: 'categoryGrid',
      title: 'Category Grid (Myntra-Style)',
      description: 'Select categories and add custom discount text for the large grid on the homepage.',
      type: 'array',
      of: [{type: 'featuredCategory'}], 
      group: 'legacy'
    }),

    // --- Section Banners (Fixed Positions) ---
    defineField({
      name: 'sectionBanners',
      title: 'Product Section Banners (Legacy)',
      description: 'Old fixed banners for New Arrivals, Best Sellers, etc.',
      type: 'array',
      group: 'legacy',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'tag',
            title: 'Section Tag',
            type: 'string',
            options: {
              list: [
                { title: 'New Arrivals', value: 'new-arrivals' },
                { title: 'Best Sellers', value: 'best-sellers' },
                { title: 'Featured Products', value: 'featured-products' },
              ],
              layout: 'radio'
            },
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'bannerImage',
            title: 'Banner Image',
            type: 'image',
            options: { hotspot: true },
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'link',
            title: 'Link (Optional)',
            type: 'string'
          })
        ]
      }]
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Layout',
        subtitle: 'Manage via Page Builder Tab'
      }
    }
  }
})