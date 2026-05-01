export function SkeletonBar({ className = '' }) {
  return <div className={`skeleton-shimmer rounded-full ${className}`} />;
}

export function HeaderSkeleton() {
  return (
    <div className='h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-white'>
      <SkeletonBar className='h-6 w-32' />
      <div className='flex items-center gap-4'>
        <SkeletonBar className='h-9 w-80 rounded-sm mr-5' />
        <SkeletonBar className='h-6 w-6 rounded-full mr-15' />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ asTr = true }) {
  if (asTr) {
    return (
      <tr style={{ borderTop: '1px solid rgb(230,230,237)' }}>
        <td
          style={{
            paddingLeft: 16,
            width: 44,
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <div className='skeleton-shimmer rounded h-4 w-4' />
        </td>
        <td style={{ paddingLeft: 48, paddingTop: 22, paddingBottom: 22 }}>
          <div className='skeleton-shimmer rounded-full h-3.5 w-48' />
        </td>
        <td style={{ paddingTop: 22, paddingBottom: 22 }}>
          <div className='skeleton-shimmer rounded-full h-3 w-24' />
        </td>
        <td style={{ paddingTop: 22, paddingBottom: 22 }}>
          <div className='skeleton-shimmer rounded-full h-3 w-20' />
        </td>
        <td style={{ paddingTop: 22, paddingBottom: 22 }}>
          <div className='skeleton-shimmer rounded-full h-3 w-16' />
        </td>
        <td
          style={{
            paddingRight: 30,
            textAlign: 'right',
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <div className='skeleton-shimmer rounded-full h-3 w-14 ml-auto' />
        </td>
        <td
          style={{
            paddingRight: 48,
            textAlign: 'right',
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <div className='skeleton-shimmer rounded-full h-3 w-16 ml-auto' />
        </td>
        <td style={{ width: 60, paddingTop: 22, paddingBottom: 22 }}>
          <div className='skeleton-shimmer rounded-full h-4 w-4 mx-auto' />
        </td>
      </tr>
    );
  }

  return (
    <div className='grid grid-cols-[44px_2.4fr_1.4fr_1.4fr_1fr_1fr_1.1fr_52px] items-center pl-4 pr-1.5 py-4 border-t border-gray-100'>
      <SkeletonBar className='h-4 w-4 rounded-sm' />
      <SkeletonBar className='h-3.5 w-48' />
      <SkeletonBar className='h-3 w-24' />
      <SkeletonBar className='h-3 w-20' />
      <SkeletonBar className='h-3 w-16' />
      <SkeletonBar className='h-3 w-14 ml-auto' />
      <SkeletonBar className='h-3 w-16 ml-auto' />
      <SkeletonBar className='h-4 w-4 ml-auto mr-3' />
    </div>
  );
}

export function InventoryPageSkeleton() {
  return (
    <div className='pt-6 px-6 flex flex-col h-full'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <SkeletonBar className='h-8 w-56 mb-4' />
          <div className='flex gap-6 mt-1'>
            <div>
              <SkeletonBar className='h-3 w-20 mb-2' />
              <SkeletonBar className='h-5 w-8' />
            </div>
            <div className='w-px bg-gray-200 mx-2' />
            <div>
              <SkeletonBar className='h-3 w-28 mb-2' />
              <SkeletonBar className='h-5 w-24' />
            </div>
            <div className='w-px bg-gray-200 mx-2' />
            <div>
              <SkeletonBar className='h-3 w-24 mb-2' />
              <SkeletonBar className='h-5 w-14' />
            </div>
          </div>
        </div>
        <div className='flex gap-3'>
          <SkeletonBar className='h-9 w-36 rounded-sm' />
          <SkeletonBar className='h-9 w-36 rounded-sm' />
          <SkeletonBar className='h-9 w-28 rounded-sm' />
        </div>
      </div>

      <div className='flex items-center gap-4 mt-2 mb-4'>
        <SkeletonBar className='h-10 w-60 rounded-sm' />
        <SkeletonBar className='h-10 w-60 rounded-sm' />
        <SkeletonBar className='h-10 flex-1 mr-5 rounded-sm' />
      </div>

      <div className='mt-2 bg-white border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col'>
        <div className='overflow-y-auto flex-1'>
          <table
            className='inventorytbl w-full'
            style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}
          >
            <colgroup>
              <col style={{ width: 44 }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: 60 }} />
            </colgroup>

            <thead
              style={{
                position: 'sticky',
                top: -1,
                left: 0,
                borderBottom: '1px solid rgb(230,230,237)',
                borderTop: '1px solid rgb(230,230,237)',
                backgroundColor: 'rgb(248,249,250)',
                zIndex: 10,
              }}
            >
              <tr>
                <th
                  className='pd-y-5 tx-left pl-4 tx-13 uppercase tracking-wide text-gray-500'
                  style={{ width: 44 }}
                />
                <th
                  className='pd-y-5 tx-left tx-13 uppercase tracking-wide text-gray-500'
                  style={{ paddingLeft: 48 }}
                >
                  Item
                </th>
                <th className='pd-y-5 tx-left tx-13 uppercase tracking-wide text-gray-500'>
                  Arrival Info
                </th>
                <th className='pd-y-5 tx-left tx-13 uppercase tracking-wide text-gray-500'>
                  Expiration Info
                </th>
                <th className='pd-y-5 tx-left tx-13 uppercase tracking-wide text-gray-500'>
                  Quantity
                </th>
                <th
                  className='pd-y-5 tx-right tx-13 uppercase tracking-wide text-gray-500'
                  style={{ paddingRight: 30 }}
                >
                  Unit Price
                </th>
                <th
                  className='pd-y-5 tx-right tx-13 uppercase tracking-wide text-green-600'
                  style={{ paddingRight: 48 }}
                >
                  Total Value
                </th>
                <th style={{ width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StockValueSkeleton() {
  return <SkeletonBar className='h-5 w-28 mt-1' />;
}

export function TransferProductListSkeleton() {
  return (
    <div className='flex items-center justify-center py-16'>
      <div className='flex items-center gap-4'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='w-3 h-3 rounded-full bg-emerald-600'
            style={{
              animation: 'dotBounce 0.8s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes dotBounce {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function AddItemRowSkeleton() {
  return (
    <div className='grid grid-cols-[80px_1fr_110px_160px_170px_150px_40px] px-6 py-3 items-center border-b border-gray-100'>
      <SkeletonBar className='h-7 w-14 rounded' />
      <SkeletonBar className='h-7 w-40 rounded' />
      <SkeletonBar className='h-7 w-16 rounded' />
      <SkeletonBar className='h-7 w-28 rounded' />
      <SkeletonBar className='h-7 w-28 rounded' />
      <SkeletonBar className='h-7 w-24 rounded' />
      <SkeletonBar className='h-7 w-7 rounded-full' />
    </div>
  );
}
