// app/gift-cards/page.tsx
import ComingSoon from '@/app/components/ui/ComingSoon';

export const metadata = {
  title: 'Gift Cards - Coming Soon | PocketValue',
};

export default function GiftCardsPage() {
  return (
    <ComingSoon
      featureName="PocketValue Gift Cards"
      description="Soon, you'll be able to send the perfect gift with our digital gift cards. Stay tuned!"
    />
  );
}