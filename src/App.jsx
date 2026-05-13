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
import UploadOrderModal from './components/ExternalOrder/UploadOrderModal';
import { undoTransfer } from './services/transferService';

function Layout() {
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isDetailOpen = useSelector((s) => s.externalOrder.isDetailOpen);
  const location = useLocation();
  const isExternalOrders = location.pathname.includes('external-orders');
  const queryClient = useQueryClient();

  const [transferToast, setTransferToast] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errorToast, setErrorToast] = useState('');

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

        <div className='flex-1 overflow-hidden'>
          <UploadOrderModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
          />
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
    </div>
  );
}

function App() {
  return <Layout />;
}

export default App;
