import {defineField, defineType} from 'sanity'
import { TicketIcon } from 'lucide-react';

export default defineType({
  name: 'coupon',
  title: 'Coupons',
  type: 'document',
  icon: TicketIcon,
  groups: [
    {name: 'main', title: 'Main Details', default: true},
    {name: 'rules', title: 'Usage Rules & Conditions'},
    {name: 'applicability', title: 'Applicability'},
  ],
  fields: [
    // --- Main Details Group ---
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'The unique code customers enter (e.g., WELCOME10). Must be uppercase, no spaces.',
      validation: (Rule) => Rule.required().uppercase().regex(/^[A-Z0-9_-]+$/, 'Only uppercase letters, numbers, hyphens, and underscores are allowed.'),
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Description (Internal Use)',
      type: 'string',
      description: 'A short note for what this coupon is for (e.g., "Welcome discount for new signups").',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active?',
      type: 'boolean',
      description: 'Turn this coupon on or off for all customers.',
      initialValue: true,
      group: 'main',
    }),

    // --- Usage Rules Group ---
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: { list: [ {title: 'Percentage (%)', value: 'percentage'}, {title: 'Fixed Amount (Rs.)', value: 'fixed'}, {title: 'Free Shipping', value: 'freeShipping'}, ], layout: 'radio' },
      initialValue: 'percentage',
      validation: (Rule) => Rule.required(),
      group: 'rules',
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description: 'Enter the value (e.g., 15 for 15%, or 500 for Rs. 500). Not needed for Free Shipping.',
      hidden: ({parent}) => parent?.discountType === 'freeShipping',
      validation: (Rule) => Rule.positive().error('Value must be a positive number.'),
      group: 'rules',
    }),
    defineField({
        name: 'maximumDiscount',
        title: 'Maximum Discount (Rs.)',
        type: 'number',
        description: 'Optional: For percentage discounts, cap the discount at this amount (e.g., 20% off, up to a maximum of Rs. 1,000).',
        hidden: ({parent}) => parent?.discountType !== 'percentage',
        validation: (Rule) => Rule.positive(),
        group: 'rules',
    }),
    defineField({
        name: 'minimumPurchaseAmount',
        title: 'Minimum Purchase Amount (Rs.)',
        type: 'number',
        description: 'Optional: The coupon will only apply if the cart total is above this amount.',
        group: 'rules',
    }),
    defineField({
        name: 'startDate',
        title: 'Start Date',
        type: 'datetime',
        description: 'Optional: The coupon becomes active from this date and time.',
        group: 'rules',
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'datetime',
      description: 'Optional: The coupon will not be valid after this date and time.',
      group: 'rules',
    }),
    defineField({
        name: 'totalUsageLimit',
        title: 'Total Usage Limit (for all customers)',
        type: 'number',
        description: 'Optional: Total number of times this coupon can be used across all customers.',
        validation: (Rule) => Rule.integer().positive(),
        group: 'rules',
    }),
    // === YEH NAYA FIELD ADD KAREIN ===
    defineField({
        name: 'usageLimitPerUser',
        title: 'Usage Limit Per Customer',
        type: 'number',
        description: 'Optional: How many times a single customer can use this coupon. Leave blank for unlimited.',
        initialValue: 1,
        validation: Rule => Rule.integer().positive(),
        group: 'rules',
    }),
    // --- Applicability Group ---
    defineField({
        name: 'isStackable',
        title: 'Stackable Discount',
        type: 'boolean',
        description: 'If ON, this coupon can be used even if a product is already on sale.',
        initialValue: false,
        group: 'applicability',
    }),
    // --- IMPROVEMENT #1: CONDITIONAL LOGIC FOR APPLICABILITY ---
    defineField({
      name: 'applicableTo',
      title: 'Applicable To',
      type: 'string',
      options: {
        list: [
          { title: 'Entire Order', value: 'entireOrder' },
          { title: 'Specific Products', value: 'specificProducts' },
          { title: 'Specific Categories', value: 'specificCategories' },
        ],
        layout: 'radio',
      },
      initialValue: 'entireOrder',
      group: 'applicability',
    }),
    defineField({
        name: 'applicableProducts',
        title: 'Specific Products',
        type: 'array',
        description: 'The coupon will ONLY apply to these selected products.',
        of: [{type: 'reference', to: [{type: 'product'}]}],
        hidden: ({parent}) => parent?.applicableTo !== 'specificProducts',
        group: 'applicability',
    }),
    defineField({
        name: 'applicableCategories',
        title: 'Specific Categories',
        type: 'array',
        description: 'The coupon will ONLY apply to products within these selected categories.',
        of: [{type: 'reference', to: [{type: 'category'}]}],
        hidden: ({parent}) => parent?.applicableTo !== 'specificCategories',
        group: 'applicability',
    }),
  ],
  preview: {
    select: { code: 'code', type: 'discountType', value: 'discountValue', isActive: 'isActive' },
    prepare({code, type, value, isActive}) {
      let discount = '';
      if (type === 'percentage') discount = `${value || 0}%`;
      else if (type === 'fixed') discount = `Rs. ${value || 0}`;
      else if (type === 'freeShipping') discount = 'Free Shipping';
      return { title: code, subtitle: `${discount} - ${isActive ? 'Active' : 'Inactive'}` }
    },
  },
})