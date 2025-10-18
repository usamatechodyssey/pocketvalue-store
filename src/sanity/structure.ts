

import type { StructureResolver } from 'sanity/structure'
import { Home, Instagram, Presentation, Ticket as TicketIcon, Flame, Zap, FileText, HelpCircle, BookText, ShoppingBag, CogIcon } from 'lucide-react' 

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content Management')
    .items([
      // Homepage Setup
      S.listItem()
        .title('Homepage Setup')
        .icon(Home)
        .id('homepage')
        .child( S.document().schemaType('homepage').documentId('homepage') ),
      
      // Site-wide Settings
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .id('settings')
        .child( S.document().schemaType('settings').documentId('settings').title('Edit Site-wide Settings') ),
      
      S.divider(),

      // Instagram Wall
      S.listItem()
        .title('Instagram Wall')
        .icon(Instagram)
        .id('instagramFeed')
        .child( S.document().schemaType('instagramFeed').documentId('instagramFeed') ),

      S.divider(),
      
      // Page Banners & Promotions
      S.listItem()
        .title('Promotions & Banners')
        .icon(Presentation)
        .child(
          S.list()
            .title('Banners & Sales')
            .items([
              S.listItem().title('Hero Carousel Slides').schemaType('heroCarousel').child(S.documentTypeList('heroCarousel').title('Slides')),
              S.listItem().title('Promo / Story Banners').schemaType('promoBanner').child(S.documentTypeList('promoBanner').title('All Banners')),
              S.listItem().title('Lifestyle Banners').schemaType('lifestyleBanner').child(S.documentTypeList('lifestyleBanner').title('All Lifestyle Banners')),
              S.listItem().title('Coupon Banners').icon(TicketIcon).schemaType('couponBanner').child(S.documentTypeList('couponBanner').title('All Coupon Banners')),
              S.listItem().title('Deal of the Day').icon(Flame).child( S.document().schemaType('dealOfTheDay').documentId('dealOfTheDay').title('Setup Deal of the Day')),
              S.listItem().title('Flash Sale').icon(Zap).child( S.document().schemaType('flashSale').documentId('flashSale').title('Setup Flash Sale')),
            ])
        ),
      
      S.divider(),

      // Website Pages
      S.listItem()
        .title('Website Pages')
        .icon(FileText)
        .child(
          S.list()
            .title('Pages')
            .items([
                S.listItem().title('FAQ Page').icon(HelpCircle).child( S.document().schemaType('faq').documentId('faqPage').title('Edit FAQ Page') ),
                S.listItem().title('Informational Pages').schemaType('page').child(S.documentTypeList('page').title('All Info Pages')),
            ])
        ),

      S.divider(),

      // Blog Content
      S.listItem()
        .title('Blog Content')
        .icon(BookText)
        .child(
          S.list()
            .title('Blog Management')
            .items([
              S.listItem().title('All Posts').schemaType('post').child(S.documentTypeList('post').title('Blog Posts')),
              S.listItem().title('Authors').schemaType('author').child(S.documentTypeList('author').title('Authors')),
            ])
        ),

      S.divider(),
      
      // Shop Management (Core E-commerce)
      S.listItem()
        .title('Shop Management')
        .icon(ShoppingBag)
        .child(
          S.list()
            .title('Shop Content')
            .items([
              S.listItem().title('Products').schemaType('product').child(S.documentTypeList('product').title('All Products')),
              S.listItem().title('Categories').schemaType('category').child(S.documentTypeList('category').title('All Categories')),
              // --- NAYA ITEM YAHAN ADD HUA HAI ---
              S.listItem().title('Coupons').schemaType('coupon').icon(TicketIcon).child(S.documentTypeList('coupon').title('All Coupons')),
              S.listItem().title('Product Reviews').schemaType('review').child(S.documentTypeList('review').title('All Reviews')),
            ])
        ),

      S.divider(),

      // Filter out explicitly structured items from the default list
      ...S.documentTypeListItems().filter(
        (listItem) => ![
            'homepage', 'settings', 'instagramFeed', 'promoBanner', 'heroCarousel', 
            'dealOfTheDay', 'lifestyleBanner', 'page', 'faq', 'review', 'post', 'author', 
            'category', 'product', 'couponBanner', 'flashSale',
            'coupon', // <-- Coupon yahan filter kiya
        ].includes(listItem.getId()!)
      ),
    ])
