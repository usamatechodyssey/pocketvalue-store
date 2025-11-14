// /src/sanity/schemas/settings.ts

import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'settings',
  title: 'Store Settings',
  type: 'document',
  icon: CogIcon,
   groups: [
    { name: 'general', title: 'General Info', default: true },
    { name: 'seo', title: 'Default SEO' },
    { name: 'shipping', title: 'Shipping Rules' },
    { name: 'inventory', title: 'Inventory' },
    { name: 'search', title: 'Search Suggestions' },
  ],
  fields: [
    // === NEW: General Store Information Fields ===
    // --- General Store Information Fields ---
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
      description: 'The main logo for the store, used in structured data and potentially the header.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'storeContactEmail',
      title: 'Store Contact Email',
      type: 'string',
      group: 'general',
      description: 'The main email address for customer inquiries.',
      validation: Rule => Rule.email(),
    }),
    defineField({
      name: 'storePhoneNumber',
      title: 'Store Phone Number',
      type: 'string',
      group: 'general',
      description: 'The main contact number for the store.',
    }),
    defineField({
      name: 'storeAddress',
      title: 'Physical Store Address',
      type: 'string',
      group: 'general',
      description: 'The address that appears in the footer or contact page.',
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

    // --- Default SEO Settings ---
    defineField({
        name: 'seo',
        title: 'Default SEO Settings',
        type: 'seo',
        group: 'seo',
        description: 'These are the fallback SEO settings for pages that do not have their own specific metadata. The meta title and site name will be combined.',
    }),


    // === Shipping Rules (No changes) ===
    defineField({
      name: 'shippingRules',
      title: 'Shipping Rules',
      type: 'array',
      description: 'Define shipping costs based on order subtotal. Rules are checked from top to bottom. The first matching rule is applied.',
      group: 'shipping',
      of: [
        {
          type: 'object',
          name: 'shippingRule',
          title: 'Shipping Rule',
          fields: [
            defineField({
              name: 'name',
              title: 'Rule Name (e.g., Standard, Heavy Items)',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'minAmount',
              title: 'Minimum Subtotal (Rs.)',
              type: 'number',
              description: 'This rule applies if the subtotal is THIS amount or higher.',
              initialValue: 0,
              validation: Rule => Rule.required().min(0),
            }),
            defineField({
              name: 'cost',
              title: 'Shipping Cost (Rs.)',
              type: 'number',
              description: 'Enter 0 for free shipping.',
              validation: Rule => Rule.required().min(0),
            }),
          ],
          preview: {
            select: { name: 'name', minAmount: 'minAmount', cost: 'cost' },
            prepare({ name, minAmount, cost }) {
              return {
                title: name,
                subtitle: `Applies from Rs. ${minAmount} | Cost: Rs. ${cost}`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.custom(rules => {
        if (!rules || rules.length === 0) {
          return 'At least one shipping rule is required.'
        }
        const hasBaseRule = rules.some(rule => (rule as any).minAmount === 0);
        if (!hasBaseRule) {
          return 'You must have at least one rule with a "Minimum Subtotal" of 0 for fallback.'
        }
        return true;
      })
    }),
    
    // --- Inventory Settings (No changes) ---
    defineField({
      name: 'inventorySettings',
      title: 'Inventory Management',
      type: 'object',
      description: 'Configure settings for stock and alerts.',
      group: 'inventory',
      options: { collapsible: false },
      fields: [
        defineField({
            name: 'lowStockThreshold',
            title: 'Low Stock Threshold',
            type: 'number',
            initialValue: 5,
            validation: Rule => Rule.required().min(0).integer(),
        }),
        defineField({
            name: 'alertRecipientEmail',
            title: 'Alert Recipient Email',
            type: 'string',
            initialValue: 'admin@example.com',
            validation: Rule => Rule.required().email(),
        }),
      ]
    }),

    // --- Search Settings (No changes) ---
    defineField({
      name: 'searchSettings',
      title: 'Search Suggestions',
      type: 'object',
      description: 'These suggestions will appear in the search panel on mobile and desktop.',
      group: 'search',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'trendingKeywords',
          title: 'Trending Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' }
        }),
        defineField({
          name: 'popularCategories',
          title: 'Popular Categories',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'category' }] }],
          validation: (Rule) => Rule.max(6).error('You can select a maximum of 6 categories.'),
        }),
      ],
    }),
  ],
  // This helps hide fields that aren't needed in the document view
  preview: {
    prepare() {
      return {
        title: 'Site-wide Settings'
      }
    }
  }
})