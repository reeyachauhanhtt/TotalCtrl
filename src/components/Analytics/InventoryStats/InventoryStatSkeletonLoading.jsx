import { SkeletonBar } from '../../Common/Skeleton';

// ── Supplier / Category overview rows (used in main tab) ──
function OverviewRowsSkeleton() {
  return (
    <div className='w-full'>
      <SkeletonBar
        style={{ height: 12, width: 140, borderRadius: 8, marginBottom: 16 }}
      />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className='flex justify-between items-center'
          style={{
            paddingTop: 20,
            paddingBottom: 18,
            borderBottom: i < 2 ? '1px solid #e7e7ec' : 'none',
          }}
        >
          <SkeletonBar style={{ height: 12, width: 160, borderRadius: 8 }} />
          <SkeletonBar style={{ height: 12, width: 80, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}

// ── CheckIn / CheckOut overview rows (used in main tab) ──
function CheckOverviewSkeleton() {
  return (
    <div className='w-full'>
      {/* title + picker placeholder */}
      <div className='flex items-center justify-between'>
        <SkeletonBar style={{ height: 14, width: 80, borderRadius: 8 }} />
        <SkeletonBar style={{ height: 32, width: 160, borderRadius: 6 }} />
      </div>
      {/* total value */}
      <SkeletonBar
        style={{
          height: 28,
          width: 140,
          borderRadius: 8,
          marginTop: 12,
          marginBottom: 24,
        }}
      />
      {/* rows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className='flex justify-between items-center'
          style={{
            paddingTop: 20,
            paddingBottom: 18,
            borderBottom: i < 2 ? '1px solid #e7e7ec' : 'none',
          }}
        >
          <SkeletonBar style={{ height: 12, width: 160, borderRadius: 8 }} />
          <SkeletonBar style={{ height: 12, width: 80, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}

// ── Main InventoryStats tab skeleton ──
export function InventoryStatsSkeleton() {
  return (
    <div className='px-8.75 pr-10 pb-15'>
      {/* Title + total value */}
      <div className='flex items-start justify-between mt-9.5'>
        <div>
          <SkeletonBar style={{ height: 22, width: 100, borderRadius: 8 }} />
          <div style={{ marginTop: 48 }}>
            <SkeletonBar
              style={{
                height: 12,
                width: 160,
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
            <SkeletonBar style={{ height: 56, width: 280, borderRadius: 8 }} />
          </div>
        </div>
      </div>

      {/* Supplier + Category */}
      <div className='flex w-full mt-8 gap-14 pr-30'>
        <div className='flex-1 min-w-0'>
          <OverviewRowsSkeleton />
        </div>
        <div className='flex-1 min-w-0'>
          <OverviewRowsSkeleton />
        </div>
      </div>

      {/* Check in & out label */}
      <div style={{ marginTop: 40, marginBottom: 32 }}>
        <SkeletonBar style={{ height: 12, width: 180, borderRadius: 8 }} />
      </div>

      {/* CheckIn + CheckOut */}
      <div className='flex w-full gap-14 pr-30'>
        <CheckOverviewSkeleton />
        <CheckOverviewSkeleton />
      </div>
    </div>
  );
}

// ── InventoryStatsDetail page skeleton ──
export function InventoryStatsDetailSkeleton() {
  return (
    <div style={{ padding: '0 35px' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center justify-between'
          style={{ paddingTop: 10, paddingBottom: 18 }}
        >
          <div className='flex items-center gap-3'>
            <SkeletonBar
              style={{ height: 10, width: 10, borderRadius: '50%' }}
            />
            <SkeletonBar style={{ height: 12, width: 200, borderRadius: 8 }} />
          </div>
          <SkeletonBar style={{ height: 12, width: 100, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}
