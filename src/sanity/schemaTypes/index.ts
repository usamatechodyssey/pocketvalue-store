import { type SchemaTypeDefinition } from 'sanity'
import product from '../schemas/product'
import category from '../schemas/category'
import heroCarousel from '../schemas/heroCarousel'
import homepage from '../schemas/homepage'
import productVariant from '../schemas/productVariant'
import variantAttribute from '../schemas/variantAttribute'
import review from '../schemas/review'
import post from '../schemas/post'
import author from '../schemas/author'
import blockContent from '../schemas/blockContent'
import promoBanner from '../schemas/promoBanner'
import instagramSection from '../schemas/instagramSection'
import lifestyleBanner from '../schemas/lifestyleBanner'
import Information_page from '../schemas/Information_page'
import faq from '../schemas/faq'
import dealOfTheDay from '../schemas/dealOfTheDay' // YEH LINE IMPORT KAREIN
import brand from '../schemas/brand'
import couponBanner from '../schemas/couponBanner'
import featuredCategory from '../schemas/featuredCategory'
import flashSale from '../schemas/flashSale'
import settings from '../schemas/settings'
import coupon from '../schemas/coupon'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product,category,heroCarousel,homepage,productVariant,variantAttribute,review,post,author,blockContent,promoBanner,instagramSection,lifestyleBanner,Information_page,faq,dealOfTheDay,brand,couponBanner,featuredCategory,flashSale,settings,coupon],
}

