import ExternalOrderRow from './ExternalOrderRow';

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
  isError,
  onRowClick,
  activeTab,
}) {
  function renderBody() {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={8} className='text-center text-[#737373] text-sm py-16'>
            Loading orders...
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td colSpan={8} className='text-center text-red-500 text-sm py-16'>
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
                  {/* Upload Order */}
                  <div className='relative group mb-5'>
                    <a
                      href='#'
                      className='flex items-center gap-2 px-6.5 py-3 bg-[#23a956] hover:bg-[#1e9449] text-white text-sm font-semibold rounded tracking-wide transition whitespace-nowrap'
                    >
                      <img
                        src='/icons/upload.svg'
                        alt=''
                        width={16}
                        height={16}
                      />
                      <span>Upload order</span>
                    </a>
                    <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-62 bg-[#19191c] text-white text-xs rounded px-3 py-3 leading-4 z-50 hidden group-hover:block font-normal'>
                      <p>
                        Does your supplier send you PDF confirmation receipts
                        for your orders?
                      </p>
                      <p>
                        Upload the PDF file here and we'll automatically extract
                        the order and product data for you.{' '}
                      </p>
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#19191c] rotate-45' />
                    </div>
                  </div>

                  {/* Add Order Manually */}
                  <div className='relative group'>
                    <button className='flex items-center gap-2 h-10 px-6.5 border border-[#d7d7db] rounded bg-transparent cursor-pointer text-sm font-semibold tracking-wide text-[#6b6b6f] hover:bg-gray-50 transition whitespace-nowrap'>
                      <img
                        src='/icons/plus-dark.svg'
                        alt=''
                        width={16}
                        height={16}
                      />
                      <span>Add order manually</span>
                    </button>
                    <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 w-51.75 bg-[#19191c] text-white text-xs rounded px-3 py-3 leading-4 z-50 hidden group-hover:block font-normal'>
                      Use this option to add orders without PDF order
                      confirmation from supplier
                      <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#19191c] rotate-45' />
                    </div>
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
      className='flex-1 overflow-visible'
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
