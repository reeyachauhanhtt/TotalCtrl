// src/components/External-Order/ExternalOrderRow.jsx
function getStatusBadge(status) {
  switch (status) {
    case 'Scheduled':
      return { bg: '#e7e7ec', color: '#57575b' };
    case 'Partially Delivered':
      return { bg: '#fff4bd', color: '#a08700' };
    case 'Delivered':
      return { bg: '#eaf7ee', color: '#0f6f36' };
    default:
      return { bg: '#e7e7ec', color: '#57575b' };
  }
}

// 2. StatusBadge second
function StatusBadge({ status }) {
  const { bg, color } = getStatusBadge(status);
  return (
    <label
      style={{ backgroundColor: bg, color }}
      className='inline-block text-[11px] font-semibold uppercase tracking-[0.08em] leading-4 px-2 py-0.5 rounded whitespace-nowrap'
    >
      {status}
    </label>
  );
}

export default function ExternalOrderRow({ order, onClick }) {
  const tdBase =
    'text-[12px] leading-[16px] text-[#19191c] font-normal border-b border-[#e6e6ed] align-top py-[5px]';
  const tdPadding = 'px-[0.8%] pt-[2.6%] pb-[3%]';

  const STATUS_BADGE_MAP = {
    Scheduled: 'bg-[#e7e7ec] text-[#57575b]',
    'Partially Delivered': 'bg-[#fff4bd] text-[#a08700]',
    Delivered: 'bg-[#eaf7ee] text-[#0f6f36]',
  };

  return (
    <tr className='cursor-pointer' onClick={onClick}>
      <td
        className={`${tdBase} ${tdPadding} text-left pl-0`}
        style={{ width: '30%' }}
      >
        <label className='text-[13px] font-extrabold! cursor-pointer'>
          {order.supplier}
        </label>
      </td>

      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '12%' }}
      >
        {order.orderNumber}
      </td>

      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '12%' }}
      >
        {order.totalValue}
      </td>

      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '13%' }}
      >
        {order.ordered}
      </td>

      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '13%' }}
      >
        {order.scheduled}
      </td>

      {/* Order Status Badge */}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '10%' }}
      >
        <StatusBadge status={order.status} />
      </td>

      <td
        style={{ width: '5%' }}
        className={`${tdBase} border-b border-[#e6e6ed]`}
      />

      <td
        className={`${tdBase} ${tdPadding} text-right pr-0`}
        style={{ width: '5%' }}
      >
        <img src='/img/more_arrow_dark.png' alt='' className='align-middle' />
      </td>
    </tr>
  );
}
