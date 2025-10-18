// types/couponBannerTypes.ts

interface SanityAsset {
  url?: string;
}

interface SanityFile {
  asset?: SanityAsset;
}

interface SanityLink {
  _type: 'product' | 'category';
  slug: { current: string };
}

export interface CouponBannerType {
  _id: string;
  link?: SanityLink;
  mediaType: 'image' | 'video';
  mediaUrls: {
    mobile?: SanityFile;
    tablet?: SanityFile;
    desktop?: SanityFile;
  };
  width: { mobile: string; tablet: string; desktop: string };
  height: { mobile: string; tablet: string; desktop: string };
  objectFit: 'cover' | 'contain';
  altText?: string;
}