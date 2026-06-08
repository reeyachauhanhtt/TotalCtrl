import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import AnalyticsDetail from '../components/Analytics/AnalyticsDetail';
import InventoryStats from '../components/Analytics/InventoryStats/InventoryStats';
import InventoryStatsDetail from '../components/Analytics/InventoryStats/InventoryStatsDetail';
import FoodUsage from '../components/Analytics/FoodUsage/FoodUsage';
import FoodWaste from '../components/Analytics/FoodWaste/FoodWaste';
import { setAnalyticsSelectedTab } from '../store/analyticsSlice';

export default function AnalyticsDetailPage() {
  const selectedTab = useSelector((s) => s.analytics.selectedTab);
  const [activeTab, setActiveTab] = useState(selectedTab || 'Inventory Stats');
  const selectedInventory = useSelector((s) => s.analytics.selectedInventory);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const routeTypeMap = {
    '/analytics/bystock': 'supplier',
    '/analytics/bycategory': 'category',
    '/analytics/bycheckin': 'checkIn',
    '/analytics/bycheckout': 'checkOut',
  };

  const routeMap = {
    supplier: '/analytics/bystock',
    category: '/analytics/bycategory',
    checkIn: '/analytics/bycheckin',
    checkOut: '/analytics/bycheckout',
  };

  const statsDetailType = routeTypeMap[location.pathname] ?? null;

  const handleTabChange = (tab) => {
    dispatch(setAnalyticsSelectedTab(tab));
    setActiveTab(tab);
  };

  return (
    <div className='flex flex-col h-full'>
      {!statsDetailType && (
        <AnalyticsDetail
          inventoryName={selectedInventory?.name}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      <div className='flex-1 overflow-y-auto'>
        {activeTab === 'Inventory Stats' &&
          (statsDetailType ? (
            <InventoryStatsDetail type={statsDetailType} />
          ) : (
            <InventoryStats
              onViewMore={(type) => {
                navigate(routeMap[type]);
              }}
            />
          ))}
        {activeTab === 'Food Usage' && (
          <FoodUsage
            inventoryId={selectedInventory?.id}
            onTabChange={handleTabChange}
          />
        )}
        {activeTab === 'Food Waste' && (
          <FoodWaste inventoryId={selectedInventory?.id} />
        )}
        {activeTab === 'Purchases' && null}
        {activeTab === 'Delivery Stats' && null}
        {activeTab === 'Transfers' && null}
      </div>
    </div>
  );
}
