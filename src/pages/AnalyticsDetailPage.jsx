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
import { ROUTES } from '../constants/routes';

export default function AnalyticsDetailPage() {
  const selectedTab = useSelector((s) => s.analytics.selectedTab);
  const [activeTab, setActiveTab] = useState(selectedTab || 'Inventory Stats');
  const selectedInventory = useSelector((s) => s.analytics.selectedInventory);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const routeTypeMap = {
    [ROUTES.ANALYTICS_BY_STOCK]: 'supplier',
    [ROUTES.ANALYTICS_BY_CATEGORY]: 'category',
    [ROUTES.ANALYTICS_BY_CHECKIN]: 'checkIn',
    [ROUTES.ANALYTICS_BY_CHECKOUT]: 'checkOut',
    [ROUTES.ANALYTICS_BIGGEST_ORDERS]: 'biggestorders',
    [ROUTES.ANALYTICS_BIGGEST_SUPPLIERS]: 'biggestsuppliers',
    [ROUTES.ANALYTICS_PRICE_VARIATION]: 'pricevariation',
  };

  const routeMap = {
    supplier: ROUTES.ANALYTICS_BY_STOCK,
    category: ROUTES.ANALYTICS_BY_CATEGORY,
    checkIn: ROUTES.ANALYTICS_BY_CHECKIN,
    checkOut: ROUTES.ANALYTICS_BY_CHECKOUT,
    biggestorders: ROUTES.ANALYTICS_BIGGEST_ORDERS,
    biggestsuppliers: ROUTES.ANALYTICS_BIGGEST_SUPPLIERS,
    pricevariation: ROUTES.ANALYTICS_PRICE_VARIATION,
  };

  const statsDetailType = routeTypeMap[location.pathname] ?? null;

  const isPurchaseDetail = [
    ROUTES.ANALYTICS_BIGGEST_ORDERS,
    ROUTES.ANALYTICS_BIGGEST_SUPPLIERS,
    ROUTES.ANALYTICS_PRICE_VARIATION,
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
          (location.pathname === ROUTES.ANALYTICS_BIGGEST_ORDERS ? (
            <ViewMoreDetail type='orders' />
          ) : location.pathname === ROUTES.ANALYTICS_BIGGEST_SUPPLIERS ? (
            <ViewMoreDetail type='suppliers' />
          ) : location.pathname === ROUTES.ANALYTICS_PRICE_VARIATION ? (
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
