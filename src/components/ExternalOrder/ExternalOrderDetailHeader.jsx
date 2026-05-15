import { useDispatch, useSelector } from 'react-redux';
import {
  setDetailOpen,
  setSelectedOrder,
} from '../../store/externalOrderSlice';

export default function ExternalOrderDetailHeader({ onBack }) {
  const dispatch = useDispatch();
  const selectedOrder = useSelector((s) => s.externalOrder.selectedOrder);

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
      <div className='flex items-center gap-1 text-[13px] leading-5'>
        <span className='cursor-pointer mr-3' onClick={handleBack}>
          <img src='/icons/back-icon.svg' alt='back' />
        </span>
        <span style={{ color: '#6b6b6f' }}>External Orders /</span>
        <span style={{ color: '#19191c' }}>
          &nbsp;{selectedOrder?.supplier} ({selectedOrder?.number})
        </span>
      </div>
    </div>
  );
}
