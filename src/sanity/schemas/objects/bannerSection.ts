// import { defineField, defineType } from 'sanity'
// import { LayoutTemplate, Smartphone, Monitor, Sliders } from 'lucide-react'

// export default defineType({
//   name: 'bannerSection',
//   title: 'Master Banner System',
//   type: 'object',
//   icon: LayoutTemplate,
//   groups: [
//     { name: 'layout', title: 'Layout & Grid', icon: Monitor },
//     { name: 'mobile', title: 'Mobile Settings', icon: Smartphone },
//     { name: 'style', title: 'Styling & Design', icon: Sliders },
//     { name: 'content', title: 'Banners Content', default: true },
//   ],
//   fields: [
//     // === 1. DESKTOP LAYOUT CONTROL ===
//     defineField({
//       name: 'desktopLayout',
//       title: 'Desktop Layout Pattern',
//       type: 'string',
//       group: 'layout',
//       options: {
//         list: [
//           { title: 'Simple Grid (Equal Sized Items)', value: 'grid' },
//           { title: 'Mosaic: Big Left (1 Big + 2 Small)', value: 'mosaic-left' },
//           { title: 'Mosaic: Big Right (2 Small + 1 Big)', value: 'mosaic-right' },
//           { title: 'Hero Stack (1 Top + 3 Bottom)', value: 'hero-stack' },
//         ],
//       },
//       initialValue: 'grid'
//     }),
//     // Only for Simple Grid
//     defineField({
//         name: 'gridColumns',
//         title: 'Columns (For Simple Grid)',
//         type: 'number',
//         group: 'layout',
//         hidden: ({parent}) => parent?.desktopLayout !== 'grid',
//         options: { list: [1, 2, 3, 4], layout: 'radio', direction: 'horizontal' },
//         initialValue: 1
//     }),

//     // === 2. HEIGHT & ASPECT RATIO ===
//     defineField({
//         name: 'heightMode',
//         title: 'Height Strategy',
//         type: 'string',
//         group: 'style',
//         options: {
//             list: [
//                 { title: 'Auto Aspect Ratio (No Crop)', value: 'aspect' },
//                 { title: 'Fixed Height (Cover)', value: 'fixed' },
//                 { title: 'Custom Pixel Height', value: 'custom' }
//             ],
//             layout: 'radio'
//         },
//         initialValue: 'fixed'
//     }),
//     defineField({
//         name: 'aspectRatio',
//         title: 'Aspect Ratio',
//         type: 'string',
//         group: 'style',
//         hidden: ({parent}) => parent?.heightMode !== 'aspect',
//         options: {
//             list: [
//                 { title: '16:9 (Cinematic)', value: 'aspect-video' },
//                 { title: '4:3 (Standard)', value: 'aspect-[4/3]' },
//                 { title: '1:1 (Square)', value: 'aspect-square' },
//                 { title: '21:9 (Ultra Wide)', value: 'aspect-[21/9]' },
//             ]
//         },
//         initialValue: 'aspect-video'
//     }),
//     defineField({
//         name: 'fixedHeight',
//         title: 'Fixed Height Size',
//         type: 'string',
//         group: 'style',
//         hidden: ({parent}) => parent?.heightMode !== 'fixed',
//         options: {
//             list: [
//                 { title: 'Small (300px)', value: 'h-[300px]' },
//                 { title: 'Medium (500px)', value: 'h-[500px]' },
//                 { title: 'Large (700px)', value: 'h-[700px]' }
//             ]
//         }
//     }),
//     defineField({
//         name: 'customHeightPx',
//         title: 'Custom Height (in pixels)',
//         type: 'number',
//         group: 'style',
//         hidden: ({parent}) => parent?.heightMode !== 'custom',
//         description: 'Example: 650',
//     }),

//     // === 3. MOBILE BEHAVIOR ===
//     defineField({
//         name: 'mobileBehavior',
//         title: 'Mobile Layout',
//         type: 'string',
//         group: 'mobile',
//         options: {
//             list: [
//                 { title: 'Stack (One below another)', value: 'stack' },
//                 { title: 'Swipe / Carousel', value: 'scroll' },
//                 { title: 'Grid (2 Columns)', value: 'grid-2' }
//             ],
//             layout: 'radio'
//         },
//         initialValue: 'stack'
//     }),

//     // === 4. STYLING ===
//     defineField({
//         name: 'containerSettings',
//         title: 'Container Settings',
//         type: 'object',
//         group: 'style',
//         fields: [
//             defineField({ name: 'fullWidth', title: 'Full Screen Width?', type: 'boolean', initialValue: false }),
//             defineField({ name: 'gap', title: 'Gap Size', type: 'string', options: { list: [{title:'None', value:'0'}, {title:'Small', value:'2'}, {title:'Normal', value:'4'}, {title:'Large', value:'8'}] }, initialValue: '4' }),
//             defineField({ name: 'roundedCorners', title: 'Border Radius', type: 'string', options: { list: [{title:'None', value:'none'}, {title:'Small', value:'sm'}, {title:'Medium', value:'xl'}, {title:'Round', value:'2xl'}, {title:'Full', value:'full'}] }, initialValue: 'xl' }),
//         ]
//     }),

//     // === 5. BANNERS LIST ===
//     defineField({
//       name: 'banners',
//       title: 'Banners',
//       type: 'array',
//       group: 'content',
//       of: [
//         {
//           type: 'object',
//           name: 'bannerItem',
//           title: 'Banner',
//           fields: [
//             defineField({ name: 'desktopImage', title: 'Desktop Image', type: 'image', options: { hotspot: true }, validation: Rule => Rule.required() }),
//             defineField({ name: 'mobileImage', title: 'Mobile Image', type: 'image', options: { hotspot: true } }),
//             defineField({ name: 'altText', title: 'Alt Text (SEO)', type: 'string', validation: Rule => Rule.required() }),
//             defineField({ name: 'link', title: 'Link URL', type: 'string' }),
            
//             // Text Overlay
//             defineField({ name: 'heading', title: 'Heading', type: 'string' }),
//             defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
//             defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
            
//             // Style Overrides per banner
//             defineField({ 
//                 name: 'contentPosition', 
//                 title: 'Text Position', 
//                 type: 'string', 
//                 options: { list: ['center', 'bottom-left', 'bottom-center', 'top-left'] },
//                 initialValue: 'center'
//             }),
//             defineField({ 
//                 name: 'overlayOpacity', 
//                 title: 'Dark Overlay Opacity (0-100)', 
//                 type: 'number', 
//                 initialValue: 20,
//                 validation: Rule => Rule.min(0).max(100) 
//             }),
//             defineField({
//                 name: 'textColor',
//                 title: 'Text Color',
//                 type: 'string',
//                 options: { list: [{title: 'White', value: 'text-white'}, {title: 'Black', value: 'text-black'}] },
//                 initialValue: 'text-white'
//             })
//           ],
//           preview: {
//             select: { title: 'heading', media: 'desktopImage' },
//             prepare({ title, media }) { return { title: title || 'Banner', media: media } }
//           }
//         }
//       ],
//     }),
//   ],
//   preview: {
//     select: { layout: 'desktopLayout', banners: 'banners' },
//     prepare({ layout, banners }) {
//       const count = banners ? Object.keys(banners).length : 0;
//       return { title: 'Master Banner Section', subtitle: `${layout?.toUpperCase()} | ${count} Items`, media: LayoutTemplate }
//     }
//   }
// })
import { defineField, defineType } from 'sanity'
import { LayoutTemplate, Smartphone, Monitor, Sliders } from 'lucide-react'

export default defineType({
  name: 'bannerSection',
  title: 'Master Banner System',
  type: 'object',
  icon: LayoutTemplate,
  groups: [
    { name: 'layout', title: 'Layout & Grid', icon: Monitor },
    { name: 'mobile', title: 'Mobile Settings', icon: Smartphone },
    { name: 'style', title: 'Styling & Design', icon: Sliders },
    { name: 'content', title: 'Banners Content', default: true },
  ],
  fields: [
    // === 1. DESKTOP LAYOUT CONTROL ===
    defineField({
      name: 'desktopLayout',
      title: 'Desktop Layout Pattern',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          { title: 'Simple Grid (Equal Sized Items)', value: 'grid' },
          { title: 'Mosaic: Big Left (1 Big + 2 Small)', value: 'mosaic-left' },
          { title: 'Mosaic: Big Right (2 Small + 1 Big)', value: 'mosaic-right' },
          { title: 'Hero Stack (1 Top + 3 Bottom)', value: 'hero-stack' },
        ],
      },
      initialValue: 'grid'
    }),
    // Only for Simple Grid
    defineField({
        name: 'gridColumns',
        title: 'Columns (For Simple Grid)',
        type: 'number',
        group: 'layout',
        hidden: ({parent}) => parent?.desktopLayout !== 'grid',
        options: { list: [1, 2, 3, 4], layout: 'radio', direction: 'horizontal' },
        initialValue: 1
    }),

    // === 2. HEIGHT & ASPECT RATIO ===
    defineField({
        name: 'heightMode',
        title: 'Height Strategy',
        type: 'string',
        group: 'style',
        options: {
            list: [
                { title: 'Auto Height (Based on Image Ratio)', value: 'auto' },
                { title: 'Manual Aspect Ratio', value: 'aspect' },
                { title: 'Fixed Height', value: 'fixed' },
                { title: 'Custom Pixel Height', value: 'custom' }
            ],
            layout: 'radio'
        },
        initialValue: 'auto'
    }),
    defineField({
        name: 'aspectRatio',
        title: 'Aspect Ratio',
        type: 'string',
        group: 'style',
        hidden: ({parent}) => parent?.heightMode !== 'aspect',
        options: {
            list: [
                { title: '16:9 (Cinematic)', value: 'aspect-video' },
                { title: '4:3 (Standard)', value: 'aspect-[4/3]' },
                { title: '1:1 (Square)', value: 'aspect-square' },
                { title: '21:9 (Ultra Wide)', value: 'aspect-[21/9]' },
            ]
        },
        initialValue: 'aspect-video'
    }),
    defineField({
        name: 'fixedHeight',
        title: 'Fixed Height Size',
        type: 'string',
        group: 'style',
        hidden: ({parent}) => parent?.heightMode !== 'fixed',
        options: {
            list: [
                { title: 'Small (300px)', value: 'h-[300px]' },
                { title: 'Medium (500px)', value: 'h-[500px]' },
                { title: 'Large (700px)', value: 'h-[700px]' }
            ]
        }
    }), // 🔥 FIX: Yahan par comma add kar diya hai
    defineField({
        name: 'customHeightPx',
        title: 'Custom Height (in pixels)',
        type: 'number',
        group: 'style',
        hidden: ({parent}) => parent?.heightMode !== 'custom',
        description: 'Example: 650',
    }),

    // === 3. MOBILE BEHAVIOR ===
    defineField({
        name: 'mobileBehavior',
        title: 'Mobile Layout',
        type: 'string',
        group: 'mobile',
        options: {
            list: [
                { title: 'Stack (One below another)', value: 'stack' },
                { title: 'Swipe / Carousel', value: 'scroll' },
                { title: 'Grid (2 Columns)', value: 'grid-2' }
            ],
            layout: 'radio'
        },
        initialValue: 'stack'
    }),

    // === 4. STYLING ===
    defineField({
        name: 'containerSettings',
        title: 'Container Settings',
        type: 'object',
        group: 'style',
        fields: [
            defineField({ name: 'fullWidth', title: 'Full Screen Width?', type: 'boolean', initialValue: false }),
            defineField({ name: 'gap', title: 'Gap Size', type: 'string', options: { list: [{title:'None', value:'0'}, {title:'Small', value:'2'}, {title:'Normal', value:'4'}, {title:'Large', value:'8'}] }, initialValue: '4' }),
            defineField({ name: 'roundedCorners', title: 'Border Radius', type: 'string', options: { list: [{title:'None', value:'none'}, {title:'Small', value:'sm'}, {title:'Medium', value:'xl'}, {title:'Round', value:'2xl'}, {title:'Full', value:'full'}] }, initialValue: 'xl' }),
        ]
    }),

    // === 5. BANNERS LIST ===
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'bannerItem',
          title: 'Banner',
          fields: [
            defineField({ name: 'desktopImage', title: 'Desktop Image', type: 'image', options: { hotspot: true }, validation: Rule => Rule.required() }),
            defineField({ name: 'mobileImage', title: 'Mobile Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'altText', title: 'Alt Text (SEO)', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'link', title: 'Link URL', type: 'string' }),
            
            // Text Overlay
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
            defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
            
            // Style Overrides per banner
            defineField({ 
                name: 'contentPosition', 
                title: 'Text Position', 
                type: 'string', 
                options: { list: ['center', 'bottom-left', 'bottom-center', 'top-left'] },
                initialValue: 'center'
            }),
            defineField({ 
                name: 'overlayOpacity', 
                title: 'Dark Overlay Opacity (0-100)', 
                type: 'number', 
                initialValue: 20,
                validation: Rule => Rule.min(0).max(100) 
            }),
            defineField({
                name: 'textColor',
                title: 'Text Color',
                type: 'string',
                options: { list: [{title: 'White', value: 'text-white'}, {title: 'Black', value: 'text-black'}] },
                initialValue: 'text-white'
            })
          ],
          preview: {
            select: { title: 'heading', media: 'desktopImage' },
            prepare({ title, media }) { return { title: title || 'Banner', media: media } }
          }
        }
      ],
    }),
  ],
  preview: {
    select: { layout: 'desktopLayout', banners: 'banners' },
    prepare({ layout, banners }) {
      const count = banners ? Object.keys(banners).length : 0;
      return { title: 'Master Banner Section', subtitle: `${layout?.toUpperCase()} | ${count} Items`, media: LayoutTemplate }
    }
  }
})