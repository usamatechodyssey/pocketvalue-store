import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons'

export default defineType({
  name: 'coupon',
  title: 'Coupons & Discounts',
  type: 'document',
  icon: RocketIcon,
  groups: [
    {name: 'main', title: 'Main Details', default: true},
    {name: 'rules', title: 'Usage Rules & Conditions'},
    {name: 'targeting', title: 'Targeting'},
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
      title: 'Description',
      type: 'string',
      description: 'Internal note for what this coupon is for (e.g., "Welcome discount for new signups").',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: { list: [ {title: 'Percentage (%)', value: 'percentage'}, {title: 'Fixed Amount (Rs.)', value: 'fixed'}, {title: 'Free Shipping', value: 'freeShipping'}, ], layout: 'radio' },
      initialValue: 'percentage',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description: 'Enter the value (e.g., 15 for 15%). Not needed for Free Shipping.',
      hidden: ({parent}) => parent?.discountType === 'freeShipping',
      validation: (Rule) => Rule.positive().error('Value must be positive.'),
      group: 'main',
    }),
    defineField({
        name: 'maximumDiscount',
        title: 'Maximum Discount (Rs.)',
        type: 'number',
        description: 'Optional. For percentage discounts, cap the discount at this amount (e.g., 20% off, up to a maximum of Rs. 1,000).',
        hidden: ({parent}) => parent?.discountType !== 'percentage',
        group: 'main',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Turn this coupon on or off.',
      initialValue: true,
      group: 'main',
    }),

    // --- Usage Rules Group ---
    defineField({
        name: 'minimumPurchaseAmount',
        title: 'Minimum Purchase Amount (Rs.)',
        type: 'number',
        description: 'Optional. The coupon will only apply if the cart total is above this amount.',
        initialValue: 0,
        group: 'rules',
    }),
    defineField({
        name: 'startDate',
        title: 'Start Date',
        type: 'datetime',
        description: 'Optional. The coupon becomes active from this date.',
        group: 'rules',
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'datetime',
      description: 'Optional. The coupon will not be valid after this date.',
      group: 'rules',
    }),
    defineField({
        name: 'totalUsageLimit',
        title: 'Total Usage Limit',
        type: 'number',
        description: 'Optional. Total number of times this coupon can be used across all customers.',
        group: 'rules',
    }),
    defineField({
        name: 'usageLimitPerUser',
        title: 'Usage Limit Per Customer',
        type: 'number',
        description: 'How many times a single customer (identified by phone/email) can use this coupon.',
        initialValue: 1,
        validation: (Rule) => Rule.required().min(1),
        group: 'rules',
    }),

    // --- Targeting Group ---
    defineField({
        name: 'forNewCustomersOnly',
        title: 'For New Customers Only',
        type: 'boolean',
        description: 'If ON, this coupon only works for users who have not placed any orders yet.',
        initialValue: false,
        group: 'targeting',
    }),
    defineField({
        name: 'applicableProducts',
        title: 'Apply to Specific Products ONLY',
        type: 'array',
        description: 'Optional. If you select products, the coupon will ONLY apply to them.',
        of: [{type: 'reference', to: [{type: 'product'}]}],
        group: 'targeting',
    }),
    defineField({
        name: 'applicableCategories',
        title: 'Apply to Specific Categories ONLY',
        type: 'array',
        description: 'Optional. If you select categories, the coupon ONLY applies to products in them.',
        of: [{type: 'reference', to: [{type: 'category'}]}],
        group: 'targeting',
    }),
    defineField({
      name: 'isStackable',
      title: 'Can be used with other discounts?',
      type: 'boolean',
      description: 'If ON, this coupon can be used even if a product is already on sale.',
      initialValue: false,
      group: 'targeting',
    }),
  ],
  preview: {
    select: { code: 'code', type: 'discountType', value: 'discountValue', isActive: 'isActive' },
    prepare({code, type, value, isActive}) {
      let discount = '';
      if (type === 'percentage') discount = `${value}%`;
      else if (type === 'fixed') discount = `Rs. ${value}`;
      else if (type === 'freeShipping') discount = 'Free Shipping';
      return { title: code, subtitle: `${discount} - ${isActive ? 'Active' : 'Inactive'}` }
    },
  },
})