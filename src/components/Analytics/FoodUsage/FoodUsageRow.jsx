export default function FoodUsageRow({ item }) {
  const {
    name,
    usedFood,
    usedFoodValue,
    foodWaste,
    foodWasteValue,
    total,
    checkedOut,
  } = item;

  return (
    <tr className='border-b border-[#e6e6ed] hover:bg-gray-50 transition-colors'>
      {/* Item Name */}
      <td
        className='text-left align-top pt-6.5 pb-6.5 px-3 first:pl-0 last:pr-0'
        style={{ width: '40%' }}
      >
        <span className='text-[14px] leading-5 text-[#19191c] font-normal'>
          {name}
        </span>
      </td>

      {/* Used Food */}
      <td
        className='text-left align-top pt-6.5 pb-6.5 px-3'
        style={{ width: '10%' }}
      >
        <span className='text-[14px] leading-5 text-[#19191c]'>{usedFood}</span>
      </td>

      {/* Used Food Value */}
      <td
        className='text-left align-top pt-6.5 pb-6.5 px-3'
        style={{ width: '10%' }}
      >
        <span className='text-[14px] leading-5 text-[#19191c]'>
          {usedFoodValue}
        </span>
      </td>

      {/* Food Waste */}
      <td
        className='text-left align-top pt-6.5 pb-6.5 px-3'
        style={{ width: '10%' }}
      >
        <span className='text-[14px] leading-5 text-[#19191c]'>
          {foodWaste}
        </span>
      </td>

      {/* Food Waste Value */}
      <td
        className='text-left align-top pt-6.5 pb-6.5 px-3'
        style={{ width: '10%' }}
      >
        <span className='text-[14px] leading-5 text-[#19191c]'>
          {foodWasteValue}
        </span>
      </td>

      {/* Total */}
      <td
        className='text-right align-top pt-6.5 pb-6.5 px-3'
        style={{ width: '10%' }}
      >
        <span className='text-[14px] leading-5 text-[#19191c]'>{total}</span>
      </td>

      {/* Checked Out */}
      <td
        className='text-left align-top pt-6.5 pb-6.5 px-3 last:pr-0'
        style={{ width: '10%' }}
      >
        <span className='text-[14px] leading-5 text-[#19191c]'>
          {checkedOut}
        </span>
      </td>
    </tr>
  );
}
