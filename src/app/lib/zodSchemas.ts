// /src/lib/zodSchemas.ts (FINAL & FULLY MODERNIZED)

import { z } from "zod";

// --- USER & AUTH SCHEMAS ---

export const UpdateNameSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
});

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters long." }),
})
.refine(data => data.currentPassword !== data.newPassword, {
  message: "New password cannot be the same as the current one.",
  path: ["newPassword"],
});

export const RequestPasswordResetSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Reset token is missing." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export const VerifyEmailSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

export const UpdatePhoneSchema = z.object({
    email: z.email({ message: "Please enter a valid email address." }),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number with country code." }),
});

// --- FORM & ACTION SCHEMAS ---

export const AddressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  phone: z.string().min(11, { message: "A valid phone number is required." }),
  province: z.string().min(1, { message: "Province is required." }),
  city: z.string().min(1, { message: "City is required." }),
  area: z.string().min(3, { message: "Area or locality is required." }),
  address: z.string().min(5, { message: "Street address is required." }),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export const VerifyCouponSchema = z.object({
  code: z.string().min(1, { message: "Please enter a coupon code." }).transform(val => val.trim().toUpperCase()),
  cart: z.object({
    items: z.array(z.object({ _id: z.string(), price: z.number(), quantity: z.number(), categoryIds: z.array(z.string()).optional() })),
    subtotal: z.number().min(0),
  }),
});

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1, { message: "Order ID is required." }),
  newStatus: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'On Hold']),
});

export const SendCustomEmailSchema = z.object({
  customerId: z.string().min(1, { message: "Customer ID is required." }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export const CancelOrderSchema = z.object({
  orderId: z.string().min(1, { message: "Order ID is required." }),
});

const ReturnItemSchema = z.object({
    productId: z.string(), variantKey: z.string(),
    quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
    reason: z.string().min(3, { message: "A reason for return is required." }),
});

export const CreateReturnRequestSchema = z.object({
  orderId: z.string().min(1, { message: "Order ID is missing." }),
  orderNumber: z.string().min(1, { message: "Order Number is missing." }),
  items: z.string().transform((str, ctx) => {
    try {
        const parsed = JSON.parse(str);
        const itemsArray = z.array(ReturnItemSchema).min(1, { message: "You must select at least one item to return." });
        return itemsArray.parse(parsed);
    } catch (e) {
        // --- FIX: Use raw string literal for the issue code ---
        ctx.addIssue({ code: "custom", message: "Invalid items format." });
        return z.NEVER;
    }
  }),
  customerComments: z.string().optional(),
});

export const SubmitReviewSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is missing." }),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters." }).max(1000, { message: "Comment cannot be more than 1000 characters." }),
  // --- FIX: Use modern z.url() syntax ---
  reviewImageUrl: z.url({ message: "Please provide a valid image URL." }).optional(),
});


// --- CATEGORY SCHEMAS ---

export const UpsertCategorySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
  parentId: z.string().optional().nullable(),
});

export const DeleteCategorySchema = z.object({
    categoryId: z.string().min(1, { message: "Category ID is required." }),
});

export const CategoryCsvRowSchema = z.object({
    name: z.string().min(1, { message: "CSV row missing 'name'." }),
    slug: z.string().min(1, { message: "CSV row missing 'slug'." }),
    parent_slug: z.string().optional(),
    // --- FIX: Use modern z.url() syntax ---
    image_url: z.url({ message: "Invalid 'image_url' in CSV." }).optional().or(z.literal('')),
});


// --- PRODUCT & CSV SCHEMAS ---

const ProductVariantSchema = z.object({
    _key: z.string(),
    name: z.string().min(1),
    sku: z.string().optional(),
    price: z.number().min(0),
    salePrice: z.number().min(0).optional().nullable(),
    stock: z.number().min(0).optional().nullable(),
    inStock: z.boolean(),
    images: z.array(z.any()).optional(),
    weight: z.number().min(0).optional().nullable(),
    dimensions: z.object({ height: z.number().min(0).optional().nullable(), width: z.number().min(0).optional().nullable(), depth: z.number().min(0).optional().nullable() }).optional(),
    attributes: z.array(z.object({ _key: z.string(), name: z.string(), value: z.string() })),
});

export const ProductPayloadSchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.any().optional(),
  // --- FIX: Use modern z.url() syntax ---
  videoUrl: z.url().optional().or(z.literal('')),
  brandId: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isOnDeal: z.boolean().optional(),
  rating: z.number().optional(),
  variants: z.array(ProductVariantSchema).min(1),
});

export const DeleteProductSchema = z.object({
    productId: z.string().min(1),
});

// --- FIX: Use .strict() instead of .passthrough() for better security, then merge ---
// The old .passthrough() is deprecated. The modern way is to define a loose object from the start.
// But a better way is to define what you expect and extend it if needed. Let's stick with the secure default.

const CsvParentRowSchema = z.object({
  title: z.string().min(1, { message: "Parent row must have a 'title'." }),
  slug: z.string().min(1, { message: "Parent row must have a 'slug'." }),
  description: z.string().optional(),
  brand: z.string().optional(),
  categories: z.string().optional(),
  // --- FIX: Use modern z.url() syntax ---
  videoUrl: z.url().optional().or(z.literal('')),
  isBestSeller: z.string().optional().transform(v => v?.toLowerCase() === 'true'),
  isNewArrival: z.string().optional().transform(v => v?.toLowerCase() === 'true'),
  isFeatured: z.string().optional().transform(v => v?.toLowerCase() === 'true'),
  isOnDeal: z.string().optional().transform(v => v?.toLowerCase() === 'true'),
  rating: z.coerce.number().optional(),
});

const CsvVariantRowSchema = z.object({
  variant_name: z.string().min(1, { message: "Variant row must have a 'variant_name'." }),
  variant_price: z.coerce.number().min(0, { message: "Variant price is invalid." }),
  variant_salePrice: z.coerce.number().optional(),
  variant_sku: z.string().optional(),
  variant_stock: z.coerce.number().optional(),
  variant_inStock: z.string().optional().transform(v => v?.toLowerCase() === 'true'),
  variant_images: z.string().optional(),
  variant_weight: z.coerce.number().optional(),
  variant_height: z.coerce.number().optional(),
  variant_width: z.coerce.number().optional(),
  variant_depth: z.coerce.number().optional(),
  variant_attributes: z.string().optional(),
});

// --- FIX: Use .extend() instead of .merge() ---
export const ProductCsvRowSchema = z.union([
    CsvParentRowSchema.partial().extend(CsvVariantRowSchema.shape),
    CsvParentRowSchema,
]);

// --- FIX: Pass-through logic handled in the action, not the schema ---
export const ProductGroupSchema = z.array(z.any()) // Allow any object, validation will happen in the action
  .min(2, { message: "Invalid group: Each product needs at least one parent and one variant row." })
  .refine((group): group is [any, ...any[]] => group[0].title && group[0].slug, { 
    message: "Invalid group: The first row must be a parent row with a 'title' and 'slug'." 
  });

// Define the allowed domains
const ALLOWED_EMAIL_DOMAINS = [
    'gmail.com', 'outlook.com', 'hotmail.com', 'live.com',
    'yahoo.com', 'icloud.com', 'protonmail.com',
];

// Schema for the user registration API route
export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.email({ message: "Please use a valid email address." })
    .refine(email => {
        const domain = email.split('@')[1];
        return ALLOWED_EMAIL_DOMAINS.includes(domain.toLowerCase());
    }, { message: "Please use a valid email provider (e.g., Gmail, Outlook)." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number." }),
});

// Schema for the create order API route
export const CreateOrderSchema = z.object({
  shippingAddress: AddressSchema, // Reuse our existing AddressSchema!
  cartItems: z.array(z.any()).min(1, { message: "Cart cannot be empty." }),
  totalPrice: z.number(),
  couponCode: z.string().optional(),
});

// Schema for the payment initiation API route
export const InitiatePaymentSchema = z.object({
  orderId: z.string().min(1, { message: "Order ID is required." }),
  gatewayKey: z.string().min(1, { message: "Payment Gateway is required." }),
});


// Schema for updating a user's role
export const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  newRole: z.enum(['Store Manager', 'Content Editor', 'customer']),
});

// Schema for inviting a new admin
export const InviteAdminSchema = z.object({
  email: z.email({ message: "A valid email is required." }),
  role: z.enum(['Store Manager', 'Content Editor']),
});


// --- SETTINGS SCHEMAS ---

// Schema for a single Shipping Rule
const ShippingRuleSchema = z.object({
  _id: z.string(), // This is the _key from Sanity
  name: z.string().min(1, { message: "Rule name is required." }),
  minAmount: z.number().min(0),
  cost: z.number().min(0),
});

// Schema for the general Sanity settings
export const SanitySettingsSchema = z.object({
  shippingRules: z.array(ShippingRuleSchema).optional(),
  storeContactEmail: z.email().optional().or(z.literal('')),
  storePhoneNumber: z.string().optional(),
  storeAddress: z.string().optional(),
  socialLinks: z.object({
    facebook: z.url().optional().or(z.literal('')),
    instagram: z.url().optional().or(z.literal('')),
    twitter: z.url().optional().or(z.literal('')),
  }).optional(),
});

// --- THE FIX IS HERE: Using z.looseObject() ---
const GatewayCredentialsSchema = z.looseObject({
  bankName: z.string().optional(),
  accountTitle: z.string().optional(),
  accountNumber: z.string().optional(),
  iban: z.string().optional(),
  storeId: z.string().optional(),
  hashKey: z.string().optional(),
  merchantId: z.string().optional(),
  password: z.string().optional(),
  integritySalt: z.string().optional(),
});
// Schema for a single Payment Gateway
const GatewaySchema = z.object({
  key: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  credentials: GatewayCredentialsSchema,
});

// Schema for updating the array of payment gateways
export const UpdatePaymentGatewaysSchema = z.array(GatewaySchema);

// --- ADMIN RETURN SCHEMAS ---

// Schema for updating a return request's status
export const UpdateReturnStatusSchema = z.object({
  returnId: z.string().min(1, { message: "Return ID is required." }),
  status: z.enum(['Pending', 'Approved', 'Processing', 'Completed', 'Rejected']),
  resolution: z.enum(['Refund', 'StoreCredit', 'Replacement']).optional(),
  adminComments: z.string().optional(),
});