import { defineField, defineType } from 'sanity'
import { CogIcon,LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'settings',
  title: 'Store Settings',
  type: 'document',
  icon: CogIcon,
   groups: [
    { name: 'general', title: 'General Info', default: true },
    { name: 'promotions', title: 'Promotions & Banners' }, // Naya Group Organization ke liye
    { name: 'navigation', title: 'Navigation & Menus' }, // Naya Group
    { name: 'seo', title: 'Default SEO' },
    { name: 'shipping', title: 'Shipping Rules' },
    { name: 'inventory', title: 'Inventory' },
    { name: 'search', title: 'Search Suggestions' },
  ],
  fields: [
    // === GENERAL INFO ===
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      description: 'The official name of the store (e.g., PocketValue).',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'siteLogo',
      title: 'Site Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
    }),
    defineField({
      name: 'storeContactEmail',
      title: 'Store Contact Email',
      type: 'string',
      group: 'general',
      validation: Rule => Rule.email(),
    }),
    defineField({
      name: 'storePhoneNumber',
      title: 'Store Phone Number',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'storeAddress',
      title: 'Physical Store Address',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'general',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter (X) URL', type: 'url' }),
      ],
    }),

      // === NEW: DYNAMIC SECONDARY NAV (Left/Right Control) ===
    defineField({
      name: 'secondaryNavLinks',
      title: 'Secondary Navigation Bar',
      type: 'array',
      group: 'navigation',
      description: 'Manage links appearing below the main header (e.g., "Today\'s Deals", "Help").',
      of: [
        {
          type: 'object',
          name: 'navLink',
          icon: LinkIcon,
          fields: [
            defineField({
              name: 'label',
              title: 'Link Text',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'string',
              initialValue: '/',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'position',
              title: 'Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Left Side', value: 'left' },
                  { title: 'Right Side', value: 'right' },
                ],
                layout: 'radio' // Radio buttons dikhenge, select karna asaan hoga
              },
              initialValue: 'left',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'isHighlight',
              title: 'Highlight this Link?',
              type: 'boolean',
              initialValue: false,
              description: 'If ON, the link will be Orange (e.g., for Deals).'
            })
          ],
         preview: {
  select: {
    title: 'label',
    position: 'position',
    highlight: 'isHighlight'
  },
  prepare({ title, position, highlight }) {
    // Safe Check: Agar position exist karta hai tabhi uppercase karo, warna empty string
    const posText = position ? position.toUpperCase() : 'NO POSITION';
    
    return {
      title: title || 'New Link',
      subtitle: `${posText} side ${highlight ? '(Highlighted)' : ''}`,
      media: LinkIcon
    }
  }
}
        }
      ]
    }),


    // === NEW: DYNAMIC ACTION BAR SETTINGS ===
    defineField({
      name: 'topBarAnnouncements',
      title: 'Top Action Bar Text (Marquee)',
      type: 'array',
      group: 'promotions', // Alag group taake dhoondna asaan ho
      description: 'Add specific taglines like "Free Delivery", "PocketValue Trust", etc. These will scroll at the top.',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),

    // === SEO ===
    defineField({
        name: 'seo',
        title: 'Default SEO Settings',
        type: 'seo',
        group: 'seo',
    }),

    // === SHIPPING RULES ===
    defineField({
      name: 'shippingRules',
      title: 'Shipping Rules',
      type: 'array',
      group: 'shipping',
      of: [
        {
          type: 'object',
          name: 'shippingRule',
          title: 'Shipping Rule',
          fields: [
            defineField({ name: 'name', title: 'Rule Name', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'minAmount', title: 'Minimum Subtotal (Rs.)', type: 'number', initialValue: 0, validation: Rule => Rule.required().min(0) }),
            defineField({ name: 'cost', title: 'Shipping Cost (Rs.)', type: 'number', validation: Rule => Rule.required().min(0) }),
              
  // ✅ NEW FIELD HERE
  defineField({
    name: 'isOnCall',
    title: 'Shipping on Call?',
    type: 'boolean',
    initialValue: false,
    description: 'Check this if shipping cost will be decided on phone.'
  }),
          ],
          preview: {
            select: { name: 'name', minAmount: 'minAmount', cost: 'cost' },
            prepare({ name, minAmount, cost }) {
              return { title: name, subtitle: `Applies from Rs. ${minAmount} | Cost: Rs. ${cost}` }
            }
          }
        }
      ],
    }),
    
    // === INVENTORY ===
    defineField({
      name: 'inventorySettings',
      title: 'Inventory Management',
      type: 'object',
      group: 'inventory',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'lowStockThreshold', title: 'Low Stock Threshold', type: 'number', initialValue: 5 }),
        defineField({ name: 'alertRecipientEmail', title: 'Alert Recipient Email', type: 'string', initialValue: 'admin@example.com' }),
      ]
    }),

    // === SEARCH SUGGESTIONS ===
    defineField({
      name: 'searchSettings',
      title: 'Search Suggestions',
      type: 'object',
      group: 'search',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'trendingKeywords', title: 'Trending Keywords', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
        defineField({ name: 'popularCategories', title: 'Popular Categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site-wide Settings' }
    }
  }
})