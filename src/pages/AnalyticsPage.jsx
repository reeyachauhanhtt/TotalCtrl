import LightSpeedBanner from '../components/Analytics/LightSpeedBanner';
import RealTimeInventorySection from '../components/Analytics/RealTimeInventorySection';
import FoodUsageSection from '../components/Analytics/FoodUsageSection';
import PurchasesSection from '../components/Analytics/PurchasesSection';

export default function AnalyticsPage() {
  return (
    <div className='h-full overflow-y-auto px-9 pb-15'>
      <LightSpeedBanner />
      <RealTimeInventorySection />
      <FoodUsageSection />
      <PurchasesSection />
    </div>
  );
}
