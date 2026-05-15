import { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import ExternalOrderRow from './ExternalOrderRow';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import { ExternalOrderListSkeleton } from '../Common/Skeleton';

const COLUMNS = [
  { label: 'Supplier', align: 'left', width: '30%' },
  { label: 'Order Number', align: 'right', width: '12%' },
  { label: 'Total Value', align: 'right', width: '12%' },
  { label: 'Ordered', align: 'right', width: '13%' },
  { label: 'Scheduled', align: 'right', width: '13%' },
  { label: 'Order Status', align: 'right', width: '10%' },
  { label: '', align: 'right', width: '5%' },
  { label: '', align: 'right', width: '5%' },
];

export default function ExternalOrderTable({
  orders = [],
  isLoading,
  isFetching,
  isError,
  onRowClick,
  activeTab,
  onAddOrderClick,
  onUploadClick,
  isReady,
  onReturnComplete,
}) {
  useEffect(() => {
    if (!isLoading && !isFetching && onReturnComplete) {
      onReturnComplete();
    }
  }, [isLoading, isFetching]);

  if (isLoading || !isReady) return <ExternalOrderListSkeleton />;

  function renderBody() {
    if (isLoading) return null;

    if (isError) {
      return (
        <tr>
          <td
            colSpan={8}
            className='text-center text-red-600 text-sm font-extrabold py-16'
          >
            Failed to load orders.
          </td>
        </tr>
      );
    }

    if (orders.length === 0) {
      return (
        <tr style={{ overflow: 'visible' }}>
          <td colSpan={8} style={{ overflow: 'visible' }}>
            <div
              style={{
                width: '50%',
                height: '450px',
                padding: '15px 0px',
                margin: '8.5% auto 0px',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ paddingBottom: '20px' }}>
                <img
                  src='/icons/order-empty-state.svg'
                  style={{ width: '151px', height: '108px' }}
                  alt='No orders'
                />
              </div>
              <h4
                style={{
                  color: '#19191c',
                  fontWeight: '600',
                  fontSize: '24px',
                  lineHeight: '32px',
                  textAlign: 'center',
                  paddingBottom: '20px',
                }}
              >
                No {activeTab.toLowerCase()} orders
              </h4>

              {/* Buttons — only for Scheduled tab */}
              {activeTab === 'Scheduled' && (
                <>
                  <div className='mb-5'>
                    <GreenButton
                      data-tooltip-id='table-upload-tooltip'
                      data-tooltip-content="Does your supplier send you PDF confirmation receipts for your orders? Upload the PDF file here and we'll automatically extract the order and product data for you."
                      className='px-6.5 py-3 text-sm font-semibold rounded tracking-wide'
                      onClick={() => onUploadClick?.()}
                    >
                      <img
                        src='/icons/upload.svg'
                        alt=''
                        width={16}
                        height={16}
                      />
                      <span>Upload order</span>
                    </GreenButton>

                    <Tooltip
                      id='table-upload-tooltip'
                      place='top'
                      style={{
                        backgroundColor: '#19191c',
                        fontSize: 12,
                        maxWidth: 248,
                      }}
                    />
                  </div>

                  <div>
                    <WhiteButton
                      data-tooltip-id='table-add-order-tooltip'
                      data-tooltip-content='Use this option to add orders without PDF order confirmation from supplier'
                      className='h-10 w-full px-6.5 text-sm font-semibold tracking-wide flex items-center justify-center gap-2'
                      onClick={() => onAddOrderClick?.()}
                    >
                      <img
                        src='/icons/plus-dark.svg'
                        alt=''
                        width={16}
                        height={16}
                      />
                      <span>Add order manually</span>
                    </WhiteButton>

                    <Tooltip
                      id='table-add-order-tooltip'
                      place='bottom'
                      style={{
                        backgroundColor: '#19191c',
                        fontSize: 12,
                        maxWidth: 207,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <ExternalOrderRow
        key={order.id}
        order={order}
        onClick={() => onRowClick?.(order)}
      />
    ));
  }

  return (
    <div
      className='flex-1 overflow-auto'
      style={{ height: 'calc(100vh - 186px)' }}
    >
      {/* Header Bar */}
      <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
        <table
          className='border-collapse text-[13px]'
          style={{ width: '94.5%', marginLeft: '35px' }}
        >
          <thead>
            <tr>
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  style={{ width: col.width, textAlign: col.align }}
                  className='h-12 py-1.25 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa]'
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body */}
      <div className='overflow-auto'>
        <table
          className='border-collapse text-[13px]'
          style={{ width: '94.5%', marginLeft: '35px' }}
        >
          <tbody>{renderBody()}</tbody>
        </table>
      </div>
    </div>
  );
}
