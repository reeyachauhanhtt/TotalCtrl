// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

// // Wrapper to match your previous shimmer colors
// export function SkeletonBar({ className = '', style = {} }) {
//   return (
//     <Skeleton
//       className={className}
//       style={style}
//       baseColor='#ebebeb'
//       highlightColor='#f5f5f5'
//     />
//   );
// }

// export function HeaderSkeleton() {
//   return (
//     <div className='h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-white'>
//       <SkeletonBar className='w-32' style={{ height: 24 }} />
//       <div className='flex items-center gap-4'>
//         <SkeletonBar className='w-80 rounded-sm mr-5' style={{ height: 36 }} />
//         <SkeletonBar
//           className='w-6 rounded-full mr-15'
//           style={{ height: 24 }}
//         />
//       </div>
//     </div>
//   );
// }

// export function TableRowSkeleton({ asTr = true }) {
//   if (asTr) {
//     return (
//       <tr style={{ borderTop: '1px solid rgb(230,230,237)' }}>
//         <td
//           style={{
//             paddingLeft: 16,
//             width: 44,
//             paddingTop: 22,
//             paddingBottom: 22,
//           }}
//         >
//           <SkeletonBar style={{ height: 16, width: 16 }} />
//         </td>

//         <td style={{ paddingLeft: 48, paddingTop: 22, paddingBottom: 22 }}>
//           <SkeletonBar style={{ height: 14, width: '80%' }} /> {/* ← was 192 */}
//         </td>

//         <td style={{ paddingTop: 22, paddingBottom: 22 }}>
//           <SkeletonBar style={{ height: 12, width: '70%' }} /> {/* ← was 96 */}
//         </td>

//         <td style={{ paddingTop: 22, paddingBottom: 22 }}>
//           <SkeletonBar style={{ height: 12, width: '60%' }} /> {/* ← was 80 */}
//         </td>

//         <td style={{ paddingTop: 22, paddingBottom: 22 }}>
//           <SkeletonBar style={{ height: 12, width: '65%' }} /> {/* ← was 64 */}
//         </td>

//         <td
//           style={{
//             paddingRight: 30,
//             textAlign: 'right',
//             paddingTop: 22,
//             paddingBottom: 22,
//           }}
//         >
//           <SkeletonBar
//             style={{ height: 12, width: '70%', marginLeft: 'auto' }}
//           />{' '}
//           {/* ← was 56 */}
//         </td>

//         <td
//           style={{
//             paddingRight: 48,
//             textAlign: 'right',
//             paddingTop: 22,
//             paddingBottom: 22,
//           }}
//         >
//           <SkeletonBar
//             style={{ height: 12, width: '75%', marginLeft: 'auto' }}
//           />{' '}
//           {/* ← was 64 */}
//         </td>

//         <td style={{ width: 60, paddingTop: 22, paddingBottom: 22 }}>
//           <SkeletonBar style={{ height: 16, width: 16, margin: '0 auto' }} />
//         </td>
//       </tr>
//     );
//   }

//   return (
//     <div className='grid grid-cols-[44px_2.4fr_1.4fr_1.4fr_1fr_1fr_1.1fr_52px] items-center pl-4 pr-1.5 py-4 border-t border-gray-100'>
//       <SkeletonBar style={{ height: 16, width: 16 }} />
//       <SkeletonBar style={{ height: 14, width: 192 }} />
//       <SkeletonBar style={{ height: 12, width: 96 }} />
//       <SkeletonBar style={{ height: 12, width: 80 }} />
//       <SkeletonBar style={{ height: 12, width: 64 }} />
//       <SkeletonBar style={{ height: 12, width: 56, marginLeft: 'auto' }} />
//       <SkeletonBar style={{ height: 12, width: 64, marginLeft: 'auto' }} />
//       <SkeletonBar
//         style={{ height: 16, width: 16, marginLeft: 'auto', marginRight: 12 }}
//       />
//     </div>
//   );
// }

// export function InventoryPageSkeleton() {
//   return (
//     <div className='pt-6 px-6 flex flex-col h-full'>
//       <div className='flex items-start justify-between mb-4'>
//         <div>
//           <SkeletonBar style={{ height: 32, width: 224, marginBottom: 16 }} />

//           <div className='flex gap-6 mt-1'>
//             <div>
//               <SkeletonBar style={{ height: 12, width: 80, marginBottom: 8 }} />
//               <SkeletonBar style={{ height: 20, width: 32 }} />
//             </div>

//             <div className='w-px bg-gray-200 mx-2' />

//             <div>
//               <SkeletonBar
//                 style={{ height: 12, width: 112, marginBottom: 8 }}
//               />
//               <SkeletonBar style={{ height: 20, width: 96 }} />
//             </div>

//             <div className='w-px bg-gray-200 mx-2' />

//             <div>
//               <SkeletonBar style={{ height: 12, width: 96, marginBottom: 8 }} />
//               <SkeletonBar style={{ height: 20, width: 56 }} />
//             </div>
//           </div>
//         </div>

//         <div className='flex gap-3'>
//           <SkeletonBar style={{ height: 36, width: 144 }} />
//           <SkeletonBar style={{ height: 36, width: 144 }} />
//           <SkeletonBar style={{ height: 36, width: 112 }} />
//         </div>
//       </div>

//       <div className='flex items-center gap-4 mt-2 mb-4'>
//         <SkeletonBar style={{ height: 40, width: 240 }} />
//         <SkeletonBar style={{ height: 40, width: 240 }} />
//         <SkeletonBar style={{ height: 40, flex: 1, marginRight: 20 }} />
//       </div>

//       <div className='mt-2 bg-white border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col'>
//         <div className='overflow-y-auto flex-1'>
//           <table
//             className='inventorytbl w-full'
//             style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}
//           >
//             <colgroup>
//               <col style={{ width: 44 }} />
//               <col style={{ width: '28%' }} />
//               <col style={{ width: '16%' }} />
//               <col style={{ width: '16%' }} />
//               <col style={{ width: '12%' }} />
//               <col style={{ width: '12%' }} />
//               <col style={{ width: '13%' }} />
//               <col style={{ width: 60 }} />
//             </colgroup>

//             <thead
//               style={{
//                 position: 'sticky',
//                 top: -1,
//                 left: 0,
//                 borderBottom: '1px solid rgb(230,230,237)',
//                 borderTop: '1px solid rgb(230,230,237)',
//                 backgroundColor: 'rgb(248,249,250)',
//                 zIndex: 10,
//               }}
//             >
//               <tr>
//                 <th style={{ width: 44 }} />
//                 <th style={{ paddingLeft: 48 }}>Item</th>
//                 <th>Arrival Info</th>
//                 <th>Expiration Info</th>
//                 <th>Quantity</th>
//                 <th style={{ paddingRight: 30, textAlign: 'right' }}>
//                   Unit Price
//                 </th>
//                 <th style={{ paddingRight: 48, textAlign: 'right' }}>
//                   Total Value
//                 </th>
//                 <th style={{ width: 60 }} />
//               </tr>
//             </thead>

//             <tbody>
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <TableRowSkeleton key={i} />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StockValueSkeleton() {
//   return <SkeletonBar style={{ height: 20, width: 112, marginTop: 4 }} />;
// }

// export function TransferProductListSkeleton() {
//   return (
//     <div className='flex items-center justify-center py-16'>
//       <div className='flex items-center gap-4'>
//         {[0, 1, 2].map((i) => (
//           <div
//             key={i}
//             className='w-3 h-3 rounded-full bg-emerald-600'
//             style={{
//               animation: 'dotBounce 0.8s ease-in-out infinite',
//               animationDelay: `${i * 0.15}s`,
//             }}
//           />
//         ))}
//       </div>
//       <style>{`
//         @keyframes dotBounce {
//           0%, 100% { transform: scale(1); opacity: 0.7; }
//           50% { transform: scale(1.5); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }

// export function AddItemRowSkeleton() {
//   return (
//     <div className='grid grid-cols-[80px_1fr_110px_160px_170px_150px_40px] px-6 py-3 items-center border-b border-gray-100'>
//       <SkeletonBar style={{ height: 28, width: 56 }} />
//       <SkeletonBar style={{ height: 28, width: 160 }} />
//       <SkeletonBar style={{ height: 28, width: 64 }} />
//       <SkeletonBar style={{ height: 28, width: 112 }} />
//       <SkeletonBar style={{ height: 28, width: 112 }} />
//       <SkeletonBar style={{ height: 28, width: 96 }} />
//       <SkeletonBar style={{ height: 28, width: 28 }} />
//     </div>
//   );
// }

// // ─── External Orders List Skeleton ──────────────────────────────────────────────────────────────────────────────────

// export function ExternalOrderRowSkeleton() {
//   return (
//     <tr style={{ borderBottom: '1px solid #e6e6ed' }}>
//       {/* Supplier — wide */}
//       <td
//         style={{
//           paddingLeft: 35,
//           paddingTop: 22,
//           paddingBottom: 22,
//           width: '30%',
//         }}
//       >
//         <SkeletonBar style={{ height: 14, width: 350 }} />
//       </td>
//       {/* Order Number */}
//       <td style={{ paddingTop: 22, paddingBottom: 22, width: '12%' }}>
//         <SkeletonBar style={{ height: 12, width: 90, marginLeft: 'auto' }} />
//       </td>
//       {/* Total Value */}
//       <td style={{ paddingTop: 22, paddingBottom: 22, width: '12%' }}>
//         <SkeletonBar style={{ height: 12, width: 90, marginLeft: 'auto' }} />
//       </td>
//       {/* Ordered */}
//       <td style={{ paddingTop: 22, paddingBottom: 22, width: '13%' }}>
//         <SkeletonBar style={{ height: 12, width: 90, marginLeft: 'auto' }} />
//       </td>
//       {/* Scheduled */}
//       <td style={{ paddingTop: 22, paddingBottom: 22, width: '13%' }}>
//         <SkeletonBar style={{ height: 12, width: 90, marginLeft: 'auto' }} />
//       </td>
//       {/* Order Status badge */}
//       <td style={{ paddingTop: 22, paddingBottom: 22, width: '10%' }}>
//         <SkeletonBar
//           style={{ height: 12, width: 90, marginLeft: 'auto', borderRadius: 4 }}
//         />
//       </td>
//       {/* Empty */}
//       <td style={{ width: '5%' }} />
//       {/* Arrow */}
//       <td style={{ paddingTop: 22, paddingBottom: 22, width: '5%' }}>
//         <SkeletonBar style={{ height: 12, width: 50, marginLeft: 'auto' }} />
//       </td>
//     </tr>
//   );
// }

// export function ExternalOrderListSkeleton() {
//   return (
//     <div
//       className='flex-1 overflow-visible'
//       style={{ height: 'calc(100vh - 186px)' }}
//     >
//       {/* Header bar */}
//       <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
//         <table
//           className='border-collapse text-[13px]'
//           style={{ width: '94.5%', marginLeft: '35px' }}
//         >
//           <thead>
//             <tr>
//               <th
//                 className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-left'
//                 style={{ width: '30%' }}
//               >
//                 Supplier
//               </th>
//               <th
//                 className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
//                 style={{ width: '12%' }}
//               >
//                 Order Number
//               </th>
//               <th
//                 className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
//                 style={{ width: '12%' }}
//               >
//                 Total Value
//               </th>
//               <th
//                 className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
//                 style={{ width: '13%' }}
//               >
//                 Ordered
//               </th>
//               <th
//                 className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
//                 style={{ width: '13%' }}
//               >
//                 Scheduled
//               </th>
//               <th
//                 className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
//                 style={{ width: '10%' }}
//               >
//                 Order Status
//               </th>
//               <th style={{ width: '5%' }} />
//               <th style={{ width: '5%' }} />
//             </tr>
//           </thead>
//         </table>
//       </div>

//       {/* Skeleton rows */}
//       <div className='overflow-auto'>
//         <table
//           className='border-collapse text-[13px]'
//           style={{ width: '94.5%', marginLeft: '35px' }}
//         >
//           <tbody>
//             {Array.from({ length: 6 }).map((_, i) => (
//               <ExternalOrderRowSkeleton key={i} />
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // ─── External Order Header Skeleton ──────────────────────────────────────────

// export function ExternalOrderHeaderSkeleton() {
//   return (
//     <div className='h-23 flex items-center justify-between px-4 border-b border-gray-200 bg-white'>
//       <SkeletonBar style={{ height: 24, width: 160 }} />
//       <div className='flex items-center gap-4'>
//         <SkeletonBar style={{ height: 38, width: 200, borderRadius: 6 }} />
//         <SkeletonBar style={{ height: 38, width: 180, borderRadius: 6 }} />
//         <SkeletonBar style={{ height: 38, width: 150, borderRadius: 6 }} />
//       </div>
//     </div>
//   );
// }

// // ─── External Order Detail Skeleton ──────────────────────────────────────────

// export function ExternalOrderDetailSkeleton() {
//   return (
//     <div className='flex flex-col flex-1 h-full overflow-hidden'>
//       <div className='flex-1 overflow-auto'>
//         {/* Order info */}
//         <div style={{ width: '95%', margin: '40px auto 24px' }}>
//           {/* Title + badge */}
//           <div className='flex items-center mb-2 gap-4'>
//             <SkeletonBar style={{ height: 32, width: 220 }} />
//             <SkeletonBar style={{ height: 22, width: 100, borderRadius: 4 }} />
//           </div>

//           {/* Inventory + number */}
//           <div className='flex items-center gap-2 mb-6'>
//             <SkeletonBar style={{ height: 14, width: 100 }} />
//             <SkeletonBar style={{ height: 14, width: 80 }} />
//           </div>

//           {/* Stats */}
//           <div className='flex items-center gap-6'>
//             {[120, 140, 100, 60].map((w, i) => (
//               <div
//                 key={i}
//                 className='flex flex-col gap-2'
//                 style={{
//                   paddingRight: i < 3 ? 20 : 0,
//                   borderRight: i < 3 ? '1px solid #d7d7db' : 'none',
//                   paddingLeft: i > 0 ? 24 : 0,
//                 }}
//               >
//                 <SkeletonBar style={{ height: 11, width: 70 }} />
//                 <SkeletonBar style={{ height: 18, width: w }} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Table header */}
//         <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
//           <table
//             className='border-collapse'
//             style={{ width: '95%', margin: 'auto' }}
//           >
//             <thead>
//               <tr>
//                 {['40%', '15%', '20%', '15%', '10%'].map((w, i) => (
//                   <th
//                     key={i}
//                     className='h-12 bg-[#f8f9fa]'
//                     style={{ width: w }}
//                   />
//                 ))}
//               </tr>
//             </thead>
//           </table>
//         </div>

//         {/* Table rows */}
//         <table
//           className='border-collapse'
//           style={{ width: '95%', margin: 'auto' }}
//         >
//           <tbody>
//             {Array.from({ length: 4 }).map((_, i) => (
//               <tr key={i} style={{ borderBottom: '1px solid #e6e6ed' }}>
//                 <td style={{ padding: '22px 0', width: '40%' }}>
//                   <SkeletonBar style={{ height: 14, width: 200 }} />
//                 </td>
//                 <td style={{ padding: '22px 0', width: '15%' }}>
//                   <SkeletonBar
//                     style={{ height: 12, width: 80, marginLeft: 'auto' }}
//                   />
//                 </td>
//                 <td style={{ padding: '22px 0', width: '20%' }}>
//                   <SkeletonBar
//                     style={{ height: 12, width: 100, marginLeft: 'auto' }}
//                   />
//                 </td>
//                 <td style={{ padding: '22px 0', width: '15%' }}>
//                   <SkeletonBar
//                     style={{ height: 12, width: 80, marginLeft: 'auto' }}
//                   />
//                 </td>
//                 <td style={{ width: '10%' }} />
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

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

        <td
          style={{
            paddingLeft: 48,
            paddingTop: 22,
            paddingBottom: 22,
            paddingRight: 16,
          }}
        >
          <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={14} />
        </td>

        <td style={{ paddingTop: 22, paddingBottom: 22, paddingRight: 16 }}>
          <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
        </td>

        <td style={{ paddingTop: 22, paddingBottom: 22, paddingRight: 16 }}>
          <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
        </td>

        <td style={{ paddingTop: 22, paddingBottom: 22, paddingRight: 16 }}>
          <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
        </td>

        <td
          style={{
            paddingRight: 30,
            textAlign: 'right',
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
        </td>

        <td
          style={{
            paddingRight: 48,
            textAlign: 'right',
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
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
    <div className='flex flex-col h-full overflow-hidden'>
      {/* Main section skeleton — matches InventoryMainSection's ml-5 px-6 */}
      <div className='ml-5 px-6 bg-white pt-6 pb-4'>
        {/* Title + buttons row */}
        <div className='flex items-center justify-between mb-2'>
          <SkeletonBar style={{ height: 36, width: 220 }} />
          <div className='flex gap-4'>
            <SkeletonBar style={{ height: 36, width: 144 }} />
            <SkeletonBar style={{ height: 36, width: 144 }} />
            <SkeletonBar style={{ height: 36, width: 112 }} />
          </div>
        </div>

        {/* Stats row */}
        <div className='flex gap-3 text-sm mt-3 mb-3'>
          <div>
            <SkeletonBar style={{ height: 12, width: 80, marginBottom: 8 }} />
            <SkeletonBar style={{ height: 20, width: 32 }} />
          </div>
          <div className='h-10 w-px bg-gray-200 mx-2' />
          <div>
            <SkeletonBar style={{ height: 12, width: 112, marginBottom: 8 }} />
            <SkeletonBar style={{ height: 20, width: 96 }} />
          </div>
          <div className='h-10 w-px bg-gray-200 mx-2' />
          <div>
            <SkeletonBar style={{ height: 12, width: 96, marginBottom: 8 }} />
            <SkeletonBar style={{ height: 20, width: 56 }} />
          </div>
        </div>

        {/* Filters row */}
        <div className='flex items-center gap-4 mt-2'>
          <SkeletonBar style={{ height: 40, width: 240 }} />
          <SkeletonBar style={{ height: 40, width: 240 }} />
          <SkeletonBar style={{ height: 40, flex: 1, marginRight: 20 }} />
        </div>
      </div>

      {/* Table */}
      <div className='flex-1 min-h-0 overflow-y-auto bg-white shadow-sm'>
        <table
          className='inventorytbl w-full'
          style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}
        >
          <colgroup>
            <col style={{ width: 44 }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: 60 }} />
          </colgroup>
          <thead
            style={{
              position: 'sticky',
              top: -1,
              zIndex: 9,
              backgroundColor: 'rgb(248,249,250)',
              borderTop: '1px solid #dee2e6',
              borderBottom: '1px solid #dee2e6',
            }}
          >
            <tr>
              <th style={{ width: 44, paddingTop: 12, paddingBottom: 12 }} />
              <th
                style={{
                  paddingLeft: 48,
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#5b636a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textAlign: 'left',
                }}
              >
                Item
              </th>
              <th
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#5b636a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textAlign: 'left',
                }}
              >
                Arrival info.
              </th>
              <th
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#5b636a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textAlign: 'left',
                }}
              >
                Expiration info.
              </th>
              <th
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#5b636a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textAlign: 'left',
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#5b636a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 12,
                  fontWeight: 400,
                  color: '#5b636a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textAlign: 'right',
                  paddingRight: 30,
                }}
              >
                Total value
              </th>
              <th style={{ width: 60 }} />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} asTr />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StockValueSkeleton() {
  return <SkeletonBar style={{ height: 20, width: 112, marginTop: 4 }} />;
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

// ─── External Orders List Skeleton ─────────────────────────────────────────────

export function ExternalOrderRowSkeleton() {
  return (
    <tr style={{ borderBottom: '1px solid #e6e6ed' }}>
      <td
        style={{
          paddingLeft: 35,
          paddingTop: 22,
          paddingBottom: 22,
          paddingRight: 16,
          width: '30%',
        }}
      >
        <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={14} />
      </td>
      <td
        style={{
          paddingTop: 22,
          paddingBottom: 22,
          paddingRight: 16,
          width: '12%',
        }}
      >
        <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
      </td>
      <td
        style={{
          paddingTop: 22,
          paddingBottom: 22,
          paddingRight: 16,
          width: '12%',
        }}
      >
        <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
      </td>
      <td
        style={{
          paddingTop: 22,
          paddingBottom: 22,
          paddingRight: 16,
          width: '13%',
        }}
      >
        <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
      </td>
      <td
        style={{
          paddingTop: 22,
          paddingBottom: 22,
          paddingRight: 16,
          width: '13%',
        }}
      >
        <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
      </td>
      <td
        style={{
          paddingTop: 22,
          paddingBottom: 22,
          paddingRight: 16,
          width: '10%',
        }}
      >
        <Skeleton
          baseColor='#ebebeb'
          highlightColor='#f5f5f5'
          height={12}
          borderRadius={4}
        />
      </td>
      <td style={{ width: '5%' }} />
      <td style={{ paddingTop: 22, paddingBottom: 22, width: '5%' }}>
        <Skeleton baseColor='#ebebeb' highlightColor='#f5f5f5' height={12} />
      </td>
    </tr>
  );
}

export function ExternalOrderListSkeleton() {
  return (
    <div
      className='flex-1 overflow-visible'
      style={{ height: 'calc(100vh - 186px)' }}
    >
      {/* Header bar */}
      <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
        <table
          className='border-collapse text-[13px]'
          style={{ width: '94.5%', marginLeft: '35px' }}
        >
          <thead>
            <tr>
              <th
                className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-left'
                style={{ width: '30%' }}
              >
                Supplier
              </th>
              <th
                className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
                style={{ width: '12%' }}
              >
                Order Number
              </th>
              <th
                className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
                style={{ width: '12%' }}
              >
                Total Value
              </th>
              <th
                className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
                style={{ width: '13%' }}
              >
                Ordered
              </th>
              <th
                className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
                style={{ width: '13%' }}
              >
                Scheduled
              </th>
              <th
                className='h-12 py-1 text-[11px] font-bold uppercase tracking-[1px] text-[#737373] bg-[#f8f9fa] text-right'
                style={{ width: '10%' }}
              >
                Order Status
              </th>
              <th style={{ width: '5%' }} />
              <th style={{ width: '5%' }} />
            </tr>
          </thead>
        </table>
      </div>

      {/* Skeleton rows */}
      <div className='overflow-auto'>
        <table
          className='border-collapse text-[13px]'
          style={{ width: '94.5%', marginLeft: '35px' }}
        >
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <ExternalOrderRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── External Order Header Skeleton ──────────────────────────────────────────

export function ExternalOrderHeaderSkeleton() {
  return (
    <div className='h-23 flex items-center justify-between px-4 border-b border-gray-200 bg-white'>
      <SkeletonBar style={{ height: 24, width: 160 }} />
      <div className='flex items-center gap-4'>
        <SkeletonBar style={{ height: 38, width: 200, borderRadius: 6 }} />
        <SkeletonBar style={{ height: 38, width: 180, borderRadius: 6 }} />
        <SkeletonBar style={{ height: 38, width: 150, borderRadius: 6 }} />
      </div>
    </div>
  );
}

// ─── External Order Detail Skeleton ──────────────────────────────────────────

export function ExternalOrderDetailSkeleton() {
  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden'>
      <div className='flex-1 overflow-auto'>
        {/* Order info */}
        <div style={{ width: '95%', margin: '40px auto 24px' }}>
          {/* Title + badge */}
          <div className='flex items-center mb-2 gap-4'>
            <SkeletonBar style={{ height: 32, width: 220 }} />
            <SkeletonBar style={{ height: 22, width: 100, borderRadius: 4 }} />
          </div>

          {/* Inventory + number */}
          <div className='flex items-center gap-2 mb-6'>
            <SkeletonBar style={{ height: 14, width: 100 }} />
            <SkeletonBar style={{ height: 14, width: 80 }} />
          </div>

          {/* Stats */}
          <div className='flex items-center gap-6'>
            {[120, 140, 100, 60].map((w, i) => (
              <div
                key={i}
                className='flex flex-col gap-2'
                style={{
                  paddingRight: i < 3 ? 20 : 0,
                  borderRight: i < 3 ? '1px solid #d7d7db' : 'none',
                  paddingLeft: i > 0 ? 24 : 0,
                }}
              >
                <SkeletonBar style={{ height: 11, width: 70 }} />
                <SkeletonBar style={{ height: 18, width: w }} />
              </div>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
          <table
            className='border-collapse'
            style={{ width: '95%', margin: 'auto' }}
          >
            <thead>
              <tr>
                {['40%', '15%', '20%', '15%', '10%'].map((w, i) => (
                  <th
                    key={i}
                    className='h-12 bg-[#f8f9fa]'
                    style={{ width: w }}
                  />
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Table rows */}
        <table
          className='border-collapse'
          style={{ width: '95%', margin: 'auto' }}
        >
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e6e6ed' }}>
                <td style={{ padding: '22px 0', width: '40%' }}>
                  <SkeletonBar style={{ height: 14, width: 200 }} />
                </td>
                <td style={{ padding: '22px 0', width: '15%' }}>
                  <SkeletonBar
                    style={{ height: 12, width: 80, marginLeft: 'auto' }}
                  />
                </td>
                <td style={{ padding: '22px 0', width: '20%' }}>
                  <SkeletonBar
                    style={{ height: 12, width: 100, marginLeft: 'auto' }}
                  />
                </td>
                <td style={{ padding: '22px 0', width: '15%' }}>
                  <SkeletonBar
                    style={{ height: 12, width: 80, marginLeft: 'auto' }}
                  />
                </td>
                <td style={{ width: '10%' }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
