// AnalyticsDetailPage.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnalyticsDetail from '../components/Analytics/AnalyticsDetail';
import InventoryStats from '../components/Analytics/InventoryStats/InventoryStats';

export default function AnalyticsDetailPage() {
  const selectedTab = useSelector((s) => s.analytics.selectedTab);
  const [activeTab, setActiveTab] = useState(selectedTab || 'Inventory Stats');
  const selectedInventory = useSelector((s) => s.analytics.selectedInventory);

  return (
    <div className='flex flex-col h-full'>
      <AnalyticsDetail
        inventoryName={selectedInventory?.name}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className='flex-1 overflow-y-auto'>
        {activeTab === 'Inventory Stats' && <InventoryStats />}
        {activeTab === 'Food Usage' && null}
        {activeTab === 'Food Waste' && null}
        {activeTab === 'Purchases' && null}
        {activeTab === 'Delivery Stats' && null}
        {activeTab === 'Transfers' && null}
      </div>
    </div>
  );
}
