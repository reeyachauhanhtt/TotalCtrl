import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  ROUTES,
  // EXTERNAL_ORDER_DETAIL_REGEX,
  // INTERNAL_ORDER_DETAIL_REGEX,
} from './constants/routes';
import Sidebar from './components/Sidebar';
import Header from './components/Inventory/Header';
import InventoryPage from './pages/InventoryPage';
import ExternalOrderPage from './pages/ExternalOrderPage';
import InternalOrderPage from './pages/InternalOrderPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ManageItemTemplatePage from './pages/ManageItemTemplatePage';
import ManageInventories from './pages/ManageInventoriesPage';
import ManageUser from './pages/ManageUserPage';

import { HeaderSkeleton } from './components/Common/Skeleton';

import ExternalOrderHeader from './components/ExternalOrder/ExternalOrderHeader';
import ExternalOrderDetailHeader from './components/ExternalOrder/ExternalOrderDetailHeader';
import InternalOrderHeader from './components/InternalOrder/InternalOrderHeader';
import InternalOrderDetailHeader from './components/InternalOrder/InternalOrderDetailHeader';
import AnalyticsHeader, {
  AnalyticsDetailHeader,
} from './components/Analytics/AnalyticsHeader';

import UploadOrderModal from './components/Common/UploadOrderModal';

import { undoTransfer } from './services/transferService';
import { fetchInventory } from './services/inventoryService';
import { setSelectedInventory } from './store/inventorySlice';
import {
  setAnalyticsDetailOpen,
  setAnalyticsSelectedInventory,
} from './store/analyticsSlice';

function Layout() {
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.externalOrder.isDetailOpen);
  const isInternalDetailOpen = useSelector((s) => s.internalOrder.isDetailOpen);
  const analyticsIsDetailOpen = useSelector(
    (state) => state.analytics.isDetailOpen,
  );
  const analyticsSelectedInventory = useSelector(
    (state) => state.analytics.selectedInventory,
  );
  const location = useLocation();

  const queryClient = useQueryClient();

  const [transferToast, setTransferToast] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const dispatch = useDispatch();

  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  useEffect(() => {
    if (!selectedInventory && inventoryData) {
      const list = inventoryData?.Data || inventoryData?.data || [];
      if (list.length > 0) dispatch(setSelectedInventory(list[0]));
    }
  }, [inventoryData, selectedInventory]);

  useEffect(() => {
    if (!transferToast) return;
    const timer = setTimeout(() => setTransferToast(null), 4000);
    return () => clearTimeout(timer);
  }, [transferToast]);

  const undoMutation = useMutation({
    mutationFn: (transferId) => undoTransfer(transferId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setTransferToast(null);
    },
    onError: (err) => console.error('Undo error:', err),
  });

  const handleTransferSuccess = useCallback((data) => {
    setTransferToast({ transferId: data.transferId });
  }, []);

  function handleUndo() {
    if (transferToast?.transferId) {
      undoMutation.mutate(transferToast.transferId);
    }
  }

  // const token = import.meta.env.VITE_API_TOKEN;
  // const payload = JSON.parse(atob(token.split('.')[1]));
  // console.log('JWT Payload:', payload);

  function renderHeader() {
    //no header in manage item template, inventories page
    if (location.pathname === ROUTES.PRODUCT_DATABASE) return null;
    if (location.pathname === ROUTES.MANAGE_STORAGE) return null;
    if (location.pathname === ROUTES.MANAGE_USER) return null;

    //inventory header
    if (!selectedInventory) return <HeaderSkeleton />;

    //external header
    const isExternalOrders = location.pathname.includes(
      ROUTES.EXTERNAL_ORDER_SEGMENT,
    );
    const isFromAnalytics = location.state?.from === 'analytics';
    const isExternalDetail =
      isDetailOpen ||
      ROUTES.EXTERNAL_ORDER_DETAIL_REGEX.test(location.pathname);

    if (isExternalOrders && isExternalDetail) {
      return isFromAnalytics ? (
        <ExternalOrderDetailHeader fromAnalytics />
      ) : (
        <ExternalOrderDetailHeader />
      );
    }
    if (isExternalOrders)
      return (
        <ExternalOrderHeader
          onUploadClick={() => setShowUploadModal(true)}
          onError={(msg) => {
            setErrorToast(msg);
            setTimeout(() => setErrorToast(''), 4000);
          }}
        />
      );

    //internal header
    const isInternalOrders = location.pathname.includes(
      ROUTES.INTERNAL_ORDER_SEGMENT,
    );
    const isInternalDetail =
      isInternalDetailOpen ||
      ROUTES.INTERNAL_ORDER_DETAIL_REGEX.test(location.pathname);

    if (isInternalOrders && isInternalDetail)
      return <InternalOrderDetailHeader />;
    if (isInternalOrders) return <InternalOrderHeader />;

    //analytics header
    const isAnalytics = location.pathname.includes(ROUTES.ANALYTICS_SEGMENT);

    const isStatsDetail = location.pathname.includes(ROUTES.ANALYTICS_BY);
    const isPurchaseDetail = [
      ROUTES.ANALYTICS_BIGGEST_ORDERS,
      ROUTES.ANALYTICS_BIGGEST_SUPPLIERS,
      ROUTES.ANALYTICS_PRICE_VARIATION,
    ].includes(location.pathname);

    if (isAnalytics && (isStatsDetail || isPurchaseDetail))
      return (
        <AnalyticsHeader
          inventories={inventoryData?.Data || inventoryData?.data || []}
          selectedInventory={analyticsSelectedInventory}
          onSelectInventory={(inv) =>
            dispatch(setAnalyticsSelectedInventory(inv))
          }
        />
      );
    if (
      isAnalytics &&
      analyticsIsDetailOpen &&
      location.pathname === ROUTES.ANALYTICS
    )
      return (
        <AnalyticsDetailHeader
          selectedInventory={analyticsSelectedInventory}
          inventories={inventoryData?.Data || inventoryData?.data || []}
          onSelectInventory={(inv) =>
            dispatch(setAnalyticsSelectedInventory(inv))
          }
          onBack={() => {
            dispatch(setAnalyticsDetailOpen(false));
            dispatch(setAnalyticsSelectedInventory(null));
          }}
          inventoryError={null}
          isInventoryLoading={isInventoryLoading}
        />
      );
    if (isAnalytics) return <AnalyticsHeader />;

    return <Header />;
  }

  return (
    <div className='h-screen flex'>
      <Sidebar />
      <div className='ml-50 flex flex-col flex-1 h-screen overflow-hidden'>
        {/* TRANSFER TOAST */}

        {transferToast && (
          <div
            className='shrink-0 bg-black text-white'
            style={{
              backgroundImage: "url('/icons/ok-circleblack.svg')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '16px center',
            }}
          >
            <div className='flex items-center justify-between py-3.5 pr-6 pl-12 text-[14px] leading-4.5 font-semibold'>
              <span>Transfer completed successfully</span>
              <button
                onClick={handleUndo}
                disabled={undoMutation.isPending}
                className='uppercase text-xs font-bold tracking-wide hover:opacity-70 transition disabled:opacity-50'
              >
                {undoMutation.isPending ? 'UNDOING...' : 'UNDO'}
              </button>
            </div>
          </div>
        )}

        {renderHeader()}

        <div className='flex-1 overflow-auto h-full'>
          <UploadOrderModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
          />
          <Routes>
            <Route
              path={ROUTES.ROOT}
              element={<Navigate to={ROUTES.INVENTORY} replace />}
            />

            <Route
              path={ROUTES.INVENTORY}
              element={
                <InventoryPage onTransferSuccess={handleTransferSuccess} />
              }
            />
            <Route
              path={ROUTES.EXTERNAL_ORDERS}
              element={<ExternalOrderPage />}
            />
            <Route
              path={ROUTES.EXTERNAL_ORDER_SCHEDULED}
              element={<ExternalOrderPage />}
            />
            <Route
              path={ROUTES.EXTERNAL_ORDER_PARTIAL}
              element={<ExternalOrderPage />}
            />
            <Route
              path={ROUTES.EXTERNAL_ORDER_DELIVERED}
              element={<ExternalOrderPage />}
            />
            <Route
              path={ROUTES.INTERNAL_ORDERS}
              element={<InternalOrderPage />}
            />
            <Route
              path={ROUTES.INTERNAL_ORDER_SCHEDULED}
              element={<InternalOrderPage />}
            />
            <Route
              path={ROUTES.INTERNAL_ORDER_PARTIAL}
              element={<InternalOrderPage />}
            />
            <Route
              path={ROUTES.INTERNAL_ORDER_DELIVERED}
              element={<InternalOrderPage />}
            />
            <Route
              path={ROUTES.ANALYTICS_OVERVIEW}
              element={<AnalyticsPage />}
            />
            <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
            <Route
              path={ROUTES.ANALYTICS_DETAILPAGE}
              element={<AnalyticsPage />}
            />
            <Route
              path={ROUTES.PRODUCT_DATABASE}
              element={<ManageItemTemplatePage />}
            />
            <Route
              path={ROUTES.MANAGE_STORAGE}
              element={<ManageInventories />}
            />
            <Route path={ROUTES.MANAGE_USER} element={<ManageUser />} />
          </Routes>
        </div>
      </div>

      {errorToast && (
        <div
          className='fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-2xl'
          style={{ backgroundColor: '#19191c', minWidth: 320, zIndex: 99999 }}
        >
          <div className='flex items-center justify-center w-5 h-5 rounded-full bg-red-600 shrink-0'>
            <span className='text-white text-[11px] font-bold leading-none'>
              !
            </span>
          </div>
          <span className='text-white text-[13px] font-bold uppercase tracking-wide flex-1'>
            {errorToast}
          </span>
          <button
            onClick={() => setErrorToast('')}
            className='text-white opacity-70 hover:opacity-100 text-[16px] cursor-pointer shrink-0'
          >
            ✕
          </button>
        </div>
      )}

      <Toaster position='bottom-center' />
    </div>
  );
}

function App() {
  return <Layout />;
}

export default App;
