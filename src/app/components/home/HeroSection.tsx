// import { client } from "@/sanity/lib/client";
// import { HERO_CAROUSEL_QUERY } from "@/sanity/lib/queries";
// import HeroCarousel from "./HeroCarousel";

// export default async function HeroSection() {
//   // Data Fetching Server Side par hogi
//   const banners = await client.fetch(HERO_CAROUSEL_QUERY);

//   return <HeroCarousel banners={banners} />;
// }
import { client } from "@/sanity/lib/client";
import { HERO_CAROUSEL_QUERY } from "@/sanity/lib/queries";
import HeroCarousel from "./HeroCarousel";

export default async function HeroSection() {
  // Data fetch server side par hoga
  const banners = await client.fetch(HERO_CAROUSEL_QUERY);

  // Agar banners nahi hain to section render hi na ho (Layout shift se bachne ke liye)
  if (!banners || banners.length === 0) return null;

  return <HeroCarousel banners={banners} />;
}