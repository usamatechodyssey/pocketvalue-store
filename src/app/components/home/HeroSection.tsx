import { client } from "@/sanity/lib/client";
import { HERO_CAROUSEL_QUERY } from "@/sanity/lib/queries";
import HeroCarousel from "./HeroCarousel";

export default async function HeroSection() {
  // Data Fetching Server Side par hogi
  const banners = await client.fetch(HERO_CAROUSEL_QUERY);

  return <HeroCarousel banners={banners} />;
}