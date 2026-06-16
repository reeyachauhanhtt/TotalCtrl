import { SkeletonBar } from '../../Common/Skeleton';

export default function InformationRow({
  type,
  item,
  date,
  transferredBy,
  inventory,
  quantity,
  value,
  isLoading = false,
}) {
  const isIn = type === 'in';

  if (isLoading) {
    return (
      <tr>
        <td
          className='px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
          style={{ width: '10%' }}
        >
          <SkeletonBar style={{ height: 16, width: 60, borderRadius: 20 }} />
        </td>
        <td
          className='px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
          style={{ width: '15%' }}
        >
          <SkeletonBar style={{ height: 16, width: 120, borderRadius: 20 }} />
        </td>
        <td
          className='px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
          style={{ width: '15%' }}
        >
          <SkeletonBar style={{ height: 16, width: 100, borderRadius: 20 }} />
        </td>
        <td
          className='px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
          style={{ width: '15%' }}
        >
          <SkeletonBar style={{ height: 16, width: 110, borderRadius: 20 }} />
        </td>
        <td
          className='px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
          style={{ width: '15%' }}
        >
          <SkeletonBar style={{ height: 16, width: 120, borderRadius: 20 }} />
        </td>
        <td
          className='px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
          style={{ width: '15%' }}
        >
          <SkeletonBar style={{ height: 16, width: 80, borderRadius: 20 }} />
        </td>
        <td
          className='px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
          style={{ width: '15%' }}
        >
          <div className='flex justify-end'>
            <SkeletonBar style={{ height: 16, width: 80, borderRadius: 20 }} />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td
        className='text-left pl-0 px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed]'
        style={{ width: '10%' }}
      >
        <div className='flex items-center'>
          <img
            src={
              isIn
                ? '/icons/arrow-right-circle.svg'
                : '/icons/arrow-left-circle.svg'
            }
            alt=''
            className='align-middle'
          />
          <span
            className='ml-2 font-semibold text-[14px] leading-5'
            style={{ color: isIn ? '#23a956' : '#e2232e' }}
          >
            {isIn ? 'IN' : 'OUT'}
          </span>
        </div>
      </td>

      <td
        className='text-left px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed] font-normal text-[14px] leading-5 text-[#333]'
        style={{ width: '15%' }}
      >
        {item}
      </td>

      <td
        className='text-left px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed] font-normal text-[14px] leading-5 text-[#333]'
        style={{ width: '15%' }}
      >
        {date}
      </td>

      <td
        className='text-left px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed] font-normal text-[14px] leading-5 text-[#333]'
        style={{ width: '15%' }}
      >
        {transferredBy}
      </td>

      <td
        className='text-left px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed] font-normal text-[14px] leading-5 text-[#333]'
        style={{ width: '15%' }}
      >
        {inventory}
      </td>

      <td
        className='text-left px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed] font-normal text-[14px] leading-5 text-[#333]'
        style={{ width: '15%' }}
      >
        {quantity}
      </td>

      <td
        className='text-right pr-0 px-3 h-18 align-top pt-6.5 border-b border-[#e6e6ed] font-normal text-[14px] leading-5 text-[#333]'
        style={{ width: '15%' }}
      >
        {value}
      </td>
    </tr>
  );
}
