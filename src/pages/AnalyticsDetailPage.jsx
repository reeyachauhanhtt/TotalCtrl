// AnalyticsDetailPage.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AnalyticsDetail from '../components/Analytics/AnalyticsDetail';

export default function AnalyticsDetailPage() {
  const [activeTab, setActiveTab] = useState('Inventory Stats');
  const selectedInventory = useSelector((s) => s.analytics.selectedInventory);

  return (
    <div className='flex flex-col h-full'>
      <AnalyticsDetail
        inventoryName={selectedInventory?.name}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className='flex-1 overflow-y-auto'>
        {/* tab content components will go here */}
      </div>
    </div>
  );
}
