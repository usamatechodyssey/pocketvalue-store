export interface HeroCarouselSlide {
  _id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  link: string;
  desktopImage: string; // Query ke baad yeh URL string ban jaayega
  mobileImage: string;  // Query ke baad yeh URL string ban jaayega
}