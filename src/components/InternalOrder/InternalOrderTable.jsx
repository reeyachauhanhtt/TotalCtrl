import InternalOrderRow from './InternalOrderRow';
import { InternalOrderListSkeleton } from '../Common/Skeleton';

const COLUMNS = [
  { label: 'From Inventory', align: 'left', width: '21%' },
  { label: 'To Inventory', align: 'left', width: '21%' },
  { label: 'Order Number', align: 'right', width: '12%' },
  { label: 'Ordered', align: 'right', width: '13%' },
  { label: 'Last Delivered', align: 'right', width: '13%' },
  { label: 'Order Status', align: 'right', width: '10%' },
  { label: '', align: 'right', width: '5%' },
  { label: '', align: 'right', width: '5%' },
];

export default function InternalOrderTable({
  orders = [],
  isLoading,
  isError,
  onRowClick,
  activeTab,
  onAddOrderClick,
  isReady,
}) {
  if (isLoading || !isReady) return <InternalOrderListSkeleton />;

  function renderBody() {
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
        <tr>
          <td colSpan={8}>
            <div
              style={{
                width: '50%',
                height: '450px',
                margin: '8.5% auto 0px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
              {activeTab === 'Scheduled' && (
                <button
                  onClick={() => onAddOrderClick?.()}
                  className='flex items-center gap-2 border border-gray-300 text-gray-950 hover:border-gray-400 px-6 py-2.5 text-sm font-semibold rounded'
                >
                  <img
                    src='/icons/plus-dark.svg'
                    alt=''
                    width={16}
                    height={16}
                  />
                  Add internal order
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <InternalOrderRow
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
