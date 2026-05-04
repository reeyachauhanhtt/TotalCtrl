import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import InventoryPage from './pages/InventoryPage';
import ExternalOrderPage from './pages/ExternalOrderPage';
import { HeaderSkeleton } from './components/Common/Skeleton';
import ExternalOrderHeader from './components/ExternalOrder/ExternalOrderHeader';
import ExternalOrderDetailHeader from './components/ExternalOrder/ExternalOrderDetailHeader';
import { undoTransfer } from './services/transferService';

function Layout() {
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.externalOrder.isDetailOpen);
  const location = useLocation();
  const isExternalOrders = location.pathname.includes('external-orders');
  const queryClient = useQueryClient();

  const [transferToast, setTransferToast] = useState(null);

  // Auto-dismiss after 4 seconds
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

  function renderHeader() {
    if (!selectedInventory) return <HeaderSkeleton />;
    if (isExternalOrders && isDetailOpen) return <ExternalOrderDetailHeader />;
    if (isExternalOrders) return <ExternalOrderHeader />;
    return <Header />;
  }

  return (
    <div className='h-screen flex'>
      <Sidebar />
      <div className='ml-50 flex flex-col flex-1 h-screen overflow-hidden'>
        {/* TRANSFER TOAST — sits above the header, full width */}
        {transferToast && (
          <div
            className='shrink-0 bg-black text-white'
            style={{
              backgroundImage: "url('/icons/ok-circleblack.svg')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '16px center',
            }}
          >
            <div className='flex items-center justify-between py-[14px] pr-6 pl-12 text-[14px] leading-[18px] font-semibold'>
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

        <div className='flex-1 overflow-hidden'>
          <Routes>
            <Route
              path='/'
              element={
                <InventoryPage onTransferSuccess={handleTransferSuccess} />
              }
            />
            <Route path='/external-orders' element={<ExternalOrderPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return <Layout />;
}

export default App;
