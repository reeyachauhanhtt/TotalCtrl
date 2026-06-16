import { useDispatch, useSelector } from 'react-redux';
import {
  setInternalDetailOpen,
  setSelectedInternalOrder,
} from '../../store/internalOrderSlice';

export default function InternalOrderDetailHeader() {
  const dispatch = useDispatch();
  const selectedOrder = useSelector((s) => s.internalOrder.selectedOrder);

  function handleBack() {
    dispatch(setInternalDetailOpen(false));
    dispatch(setSelectedInternalOrder(null));
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
          Internal Orders /
        </span>
        <span style={{ color: '#19191c' }}>
          &nbsp;{selectedOrder?.fromInventory?.name} (
          {selectedOrder?.orderNumber})
        </span>
      </div>
    </div>
  );
}
