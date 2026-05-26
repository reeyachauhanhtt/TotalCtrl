function getStatusBadge(status) {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case 'scheduled':
      return { bg: '#e7e7ec', color: '#57575b' };

    case 'partially-delivered':
    case 'partially delivered':
      return { bg: '#fff4bd', color: '#a08700' };

    case 'delivered':
      return { bg: '#eaf7ee', color: '#0f6f36' };

    default:
      return { bg: '#e7e7ec', color: '#57575b' };
  }
}

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

export default function InternalOrderRow({ order, onClick }) {
  const tdBase =
    'text-[12px] leading-[16px] text-[#19191c] font-normal border-b border-[#e6e6ed] align-top py-[5px]';
  const tdPadding = 'px-[0.8%] pt-[2.6%] pb-[3%]';

  return (
    <tr className='cursor-pointer' onClick={onClick}>
      {/* From Inventory */}
      <td
        className={`${tdBase} ${tdPadding} text-left pl-0`}
        style={{ width: '21%' }}
      >
        <label className='text-[13px] font-extrabold! cursor-pointer'>
          {order.fromInventory?.name}
        </label>
      </td>

      {/* To Inventory */}
      <td
        className={`${tdBase} ${tdPadding} text-left`}
        style={{ width: '21%' }}
      >
        {order.toInventory?.name}
      </td>

      {/* Order Number */}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '12%' }}
      >
        #{order.orderNumber}
      </td>

      {/* Ordered */}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '13%' }}
      >
        {order.orderedAtFormatted}
      </td>

      {/* Last Delivered */}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '13%' }}
      >
        {order.lastDeliveredAtFormatted ?? '----'}
      </td>

      {/* Status */}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '10%' }}
      >
        <StatusBadge status={order.statusLabel} />
      </td>

      {/* Empty */}
      <td
        style={{ width: '5%' }}
        className={`${tdBase} border-b border-[#e6e6ed]`}
      />

      {/* Arrow */}
      <td
        className={`${tdBase} ${tdPadding} text-right pr-0`}
        style={{ width: '5%' }}
      >
        <img src='/img/more_arrow_dark.png' alt='' className='align-middle' />
      </td>
    </tr>
  );
}
