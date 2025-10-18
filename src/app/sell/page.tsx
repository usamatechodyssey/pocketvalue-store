// app/sell/page.tsx
import ComingSoon from '@/app/components/ui/ComingSoon';

export const metadata = {
  title: 'Sell on PocketValue - Coming Soon',
};

export default function SellOnPocketValuePage() {
  return (
    <ComingSoon
      featureName="Sell on PocketValue"
      description="We're building a platform for sellers like you to reach thousands of customers across Pakistan. Our seller portal is launching soon!"
    />
  );
}