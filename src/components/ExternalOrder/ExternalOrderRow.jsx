import StatusBadge from '../Common/StatusBadge';

export default function ExternalOrderRow({ order, onClick }) {
  const tdBase =
    'text-[14px] leading-[16px] text-[#19191c] font-normal border-b border-[#e6e6ed] align-top py-[5px]';
  const tdPadding = 'px-[0.8%] pt-[2.6%] pb-[3%]';

  const STATUS_BADGE_MAP = {
    Scheduled: 'bg-[#e7e7ec] text-[#57575b]',
    'Partially Delivered': 'bg-[#fff4bd] text-[#a08700]',
    Delivered: 'bg-[#eaf7ee] text-[#0f6f36]',
  };

  return (
    <tr className='cursor-pointer' onClick={onClick}>
      {/*Supplier */}
      <td
        className={`${tdBase} ${tdPadding} text-left pl-0`}
        style={{ width: '30%' }}
      >
        <label className='text-[14px] font-semibold cursor-pointer'>
          {order.supplier}
        </label>
      </td>

      {/* Order Number */}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '12%' }}
      >
        {order.orderNumber}
      </td>

      {/* Total Value */}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '12%' }}
      >
        {order.totalValue}
      </td>

      {/* Ordered*/}
      <td
        className={`${tdBase} ${tdPadding} text-right`}
        style={{ width: '13%' }}
      >
        {order.ordered}
      </td>

      {/* Scheduled */}
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
        <StatusBadge variant={order.status} />
      </td>

      {/* Empty  */}
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
