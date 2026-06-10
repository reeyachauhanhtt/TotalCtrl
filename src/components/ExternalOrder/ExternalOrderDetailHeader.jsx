import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  setDetailOpen,
  setSelectedOrder,
} from '../../store/externalOrderSlice';

export default function ExternalOrderDetailHeader({ onBack }) {
  const dispatch = useDispatch();
  const selectedOrder = useSelector((s) => s.externalOrder.selectedOrder);

  const location = useLocation();
  const navigate = useNavigate();
  const isFromAnalytics = location.state?.from === 'analytics';

  function handleBack() {
    dispatch(setDetailOpen(false));
    dispatch(setSelectedOrder(null));
  }

  return (
    <div
      style={{
        width: '100%',
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e6e6ed',
        padding: '0 35px',
      }}
    >
      {isFromAnalytics ? (
        <div className='flex items-center gap-2 text-[14px] leading-5'>
          <span
            className='cursor-pointer'
            onClick={() => navigate('/external-orders')}
          >
            <img
              src='/img/grey-back.png'
              alt='back'
              style={{ height: 14, width: 9 }}
            />
          </span>

          <span
            style={{ color: '#6b6b6f', fontWeight: 400, cursor: 'pointer' }}
            onClick={() => navigate('/external-orders')}
          >
            Back to Orders
          </span>
        </div>
      ) : (
        <div className='flex items-center gap-1 text-[14px] leading-5'>
          {(selectedOrder?.status === 'scheduled' ||
            selectedOrder?.status === 'Scheduled') && (
            <span className='cursor-pointer mr-3' onClick={handleBack}>
              <img src='/icons/back-icon.svg' alt='back' />
            </span>
          )}
          <span
            style={{ color: '#6b6b6f', cursor: 'pointer' }}
            onClick={handleBack}
          >
            External Orders /
          </span>
          <span style={{ color: '#19191c' }}>
            &nbsp;{selectedOrder?.supplier} ({selectedOrder?.number})
          </span>
        </div>
      )}
    </div>
  );
}
