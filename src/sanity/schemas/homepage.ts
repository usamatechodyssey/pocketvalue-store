// sanity-project/schemas/homepage.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage Setup',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', initialValue: 'Homepage Configuration', readOnly: true}),
    defineField({name: 'featuredProductsTitle', title: 'Featured Products Section Title', type: 'string', initialValue: 'Featured Products'}),
    defineField({name: 'featuredProducts', title: 'Featured Products', type: 'array', of: [{type: 'reference', to: [{type: 'product'}]}]}),

    
    defineField({
      name: 'featuredCategoriesTitle', 
      title: 'Featured Categories Carousel Title', 
      type: 'string',
    }),
    defineField({
      name: 'featuredCategories', 
      title: 'Featured Categories (For Carousel)', 
      description: 'Select categories for the small, scrolling carousel at the top of the page.',
      type: 'array', 
      of: [{type: 'reference', to: [{type: 'category'}]}]
    }),
    
    // === YAHAN NAYA, MYNTRA-STYLE GRID SECTION SHURU HOTA HAI ===
    defineField({
      name: 'categoryGridTitle',
      title: 'Category Grid Section Title',
      type: 'string',
      initialValue: 'SHOP BY CATEGORY'
    }),
    defineField({
      name: 'categoryGrid',
      title: 'Category Grid (Myntra-Style)',
      description: 'Select categories and add custom discount text for the large grid on the homepage.',
      type: 'array',
      // Hum yahan apni nayi 'featuredCategory' type istemal kar rahe hain
      of: [{type: 'featuredCategory'}], 
    }),

       // === YAHAN SE NAYA CODE ADD KAREIN ===
    defineField({
      name: 'sectionBanners',
      title: 'Product Section Banners',
      description: 'Yahan har product section (New Arrivals, etc.) ke liye banner set karein.',
      type: 'array',
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
            description: 'Banner par click karke user kahan jayega?',
            type: 'string'
          })
        ]
      }]
    }),
  ],
})