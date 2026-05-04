import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Wrapper to match your previous shimmer colors
export function SkeletonBar({ className = '', style = {} }) {
  return (
    <Skeleton
      className={className}
      style={style}
      baseColor='#ebebeb'
      highlightColor='#f5f5f5'
    />
  );
}

export function HeaderSkeleton() {
  return (
    <div className='h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-white'>
      <SkeletonBar className='w-32' style={{ height: 24 }} />
      <div className='flex items-center gap-4'>
        <SkeletonBar className='w-80 rounded-sm mr-5' style={{ height: 36 }} />
        <SkeletonBar
          className='w-6 rounded-full mr-15'
          style={{ height: 24 }}
        />
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
          <SkeletonBar style={{ height: 16, width: 16 }} />
        </td>

        <td style={{ paddingLeft: 48, paddingTop: 22, paddingBottom: 22 }}>
          <SkeletonBar style={{ height: 14, width: 192 }} />
        </td>

        <td style={{ paddingTop: 22, paddingBottom: 22 }}>
          <SkeletonBar style={{ height: 12, width: 96 }} />
        </td>

        <td style={{ paddingTop: 22, paddingBottom: 22 }}>
          <SkeletonBar style={{ height: 12, width: 80 }} />
        </td>

        <td style={{ paddingTop: 22, paddingBottom: 22 }}>
          <SkeletonBar style={{ height: 12, width: 64 }} />
        </td>

        <td
          style={{
            paddingRight: 30,
            textAlign: 'right',
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <SkeletonBar style={{ height: 12, width: 56, marginLeft: 'auto' }} />
        </td>

        <td
          style={{
            paddingRight: 48,
            textAlign: 'right',
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <SkeletonBar style={{ height: 12, width: 64, marginLeft: 'auto' }} />
        </td>

        <td style={{ width: 60, paddingTop: 22, paddingBottom: 22 }}>
          <SkeletonBar style={{ height: 16, width: 16, margin: '0 auto' }} />
        </td>
      </tr>
    );
  }

  return (
    <div className='grid grid-cols-[44px_2.4fr_1.4fr_1.4fr_1fr_1fr_1.1fr_52px] items-center pl-4 pr-1.5 py-4 border-t border-gray-100'>
      <SkeletonBar style={{ height: 16, width: 16 }} />
      <SkeletonBar style={{ height: 14, width: 192 }} />
      <SkeletonBar style={{ height: 12, width: 96 }} />
      <SkeletonBar style={{ height: 12, width: 80 }} />
      <SkeletonBar style={{ height: 12, width: 64 }} />
      <SkeletonBar style={{ height: 12, width: 56, marginLeft: 'auto' }} />
      <SkeletonBar style={{ height: 12, width: 64, marginLeft: 'auto' }} />
      <SkeletonBar
        style={{ height: 16, width: 16, marginLeft: 'auto', marginRight: 12 }}
      />
    </div>
  );
}

export function InventoryPageSkeleton() {
  return (
    <div className='pt-6 px-6 flex flex-col h-full'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <SkeletonBar style={{ height: 32, width: 224, marginBottom: 16 }} />

          <div className='flex gap-6 mt-1'>
            <div>
              <SkeletonBar style={{ height: 12, width: 80, marginBottom: 8 }} />
              <SkeletonBar style={{ height: 20, width: 32 }} />
            </div>

            <div className='w-px bg-gray-200 mx-2' />

            <div>
              <SkeletonBar
                style={{ height: 12, width: 112, marginBottom: 8 }}
              />
              <SkeletonBar style={{ height: 20, width: 96 }} />
            </div>

            <div className='w-px bg-gray-200 mx-2' />

            <div>
              <SkeletonBar style={{ height: 12, width: 96, marginBottom: 8 }} />
              <SkeletonBar style={{ height: 20, width: 56 }} />
            </div>
          </div>
        </div>

        <div className='flex gap-3'>
          <SkeletonBar style={{ height: 36, width: 144 }} />
          <SkeletonBar style={{ height: 36, width: 144 }} />
          <SkeletonBar style={{ height: 36, width: 112 }} />
        </div>
      </div>

      <div className='flex items-center gap-4 mt-2 mb-4'>
        <SkeletonBar style={{ height: 40, width: 240 }} />
        <SkeletonBar style={{ height: 40, width: 240 }} />
        <SkeletonBar style={{ height: 40, flex: 1, marginRight: 20 }} />
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
                <th style={{ width: 44 }} />
                <th style={{ paddingLeft: 48 }}>Item</th>
                <th>Arrival Info</th>
                <th>Expiration Info</th>
                <th>Quantity</th>
                <th style={{ paddingRight: 30, textAlign: 'right' }}>
                  Unit Price
                </th>
                <th style={{ paddingRight: 48, textAlign: 'right' }}>
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
  return <SkeletonBar style={{ height: 20, width: 112, marginTop: 4 }} />;
}

// 🔥 KEEP THIS AS IS (as you requested)
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
      <SkeletonBar style={{ height: 28, width: 56 }} />
      <SkeletonBar style={{ height: 28, width: 160 }} />
      <SkeletonBar style={{ height: 28, width: 64 }} />
      <SkeletonBar style={{ height: 28, width: 112 }} />
      <SkeletonBar style={{ height: 28, width: 112 }} />
      <SkeletonBar style={{ height: 28, width: 96 }} />
      <SkeletonBar style={{ height: 28, width: 28 }} />
    </div>
  );
}
