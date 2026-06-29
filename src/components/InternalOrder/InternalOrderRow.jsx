import StatusBadge from '../Common/StatusBadge';

export default function InternalOrderRow({ order, onClick }) {
  const tdBase =
    'text-[14px] leading-[16px] text-[#19191c] font-normal border-b border-[#e6e6ed] align-top py-[5px]';
  const tdPadding = 'px-[0.8%] pt-[2.6%] pb-[3%]';

  return (
    <tr className='cursor-pointer' onClick={onClick}>
      {/* From Inventory */}
      <td
        className={`${tdBase} ${tdPadding} text-left pl-0`}
        style={{ width: '21%' }}
      >
        <label className='text-[14px] font-semibold cursor-pointer'>
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
        <StatusBadge variant={order.statusLabel} />
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
