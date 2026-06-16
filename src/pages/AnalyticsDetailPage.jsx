import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import AnalyticsDetail from '../components/Analytics/AnalyticsDetail';
import InventoryStats from '../components/Analytics/InventoryStats/InventoryStats';
import InventoryStatsDetail from '../components/Analytics/InventoryStats/InventoryStatsDetail';
import ViewMoreDetail from '../components/Analytics/Purchases/ViewMoreDetails';
import PriceVariationDetail from '../components/Analytics/Purchases/PriceVariationsDetail';
import FoodUsage from '../components/Analytics/FoodUsage/FoodUsage';
import FoodWaste from '../components/Analytics/FoodWaste/FoodWaste';
import Purchases from '../components/Analytics/Purchases/Purchases';
import DeliveryStats from '../components/Analytics/DeliveryStats/DeliveryStats';
import TransfersTab from '../components/Analytics/Transfers/Transfers';
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
    '/analytics/biggestorders': 'biggestorders',
    '/analytics/biggestsuppliers': 'biggestsuppliers',
    '/analytics/pricevariation': 'pricevariation',
  };

  const routeMap = {
    supplier: '/analytics/bystock',
    category: '/analytics/bycategory',
    checkIn: '/analytics/bycheckin',
    checkOut: '/analytics/bycheckout',
    biggestorders: '/analytics/biggestorders',
    biggestsuppliers: '/analytics/biggestsuppliers',
    pricevariation: '/analytics/pricevariations',
  };

  const statsDetailType = routeTypeMap[location.pathname] ?? null;
  const isPurchaseDetail = [
    '/analytics/biggestorders',
    '/analytics/biggestsuppliers',
    '/analytics/pricevariation',
  ].includes(location.pathname);

  const handleTabChange = (tab) => {
    dispatch(setAnalyticsSelectedTab(tab));
    setActiveTab(tab);
  };

  return (
    <div className='flex flex-col h-full'>
      {!statsDetailType && !isPurchaseDetail && (
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

        {activeTab === 'Purchases' &&
          (location.pathname === '/analytics/biggestorders' ? (
            <ViewMoreDetail type='orders' />
          ) : location.pathname === '/analytics/biggestsuppliers' ? (
            <ViewMoreDetail type='suppliers' />
          ) : location.pathname === '/analytics/pricevariation' ? (
            <PriceVariationDetail />
          ) : (
            <Purchases inventoryId={selectedInventory?.id} />
          ))}

        {activeTab === 'Delivery Stats' && <DeliveryStats />}

        {activeTab === 'Transfers' && <TransfersTab />}
      </div>
    </div>
  );
}
