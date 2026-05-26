const TABS = ['Scheduled', 'Partially Delivered', 'Delivered'];

export default function OrderTabs({ activeTab, onTabChange }) {
  return (
    <div className='flex items-center border-b border-[#e6e6ed] px-8.75 bg-white'>
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <div
            key={tab}
            onClick={() => onTabChange(tab)}
            className='pr-6 pt-4.25 pb-4 text-[14px] font-semibold text-[#19191c] cursor-pointer'
          >
            <span
              className={isActive ? 'border-b-2 border-[#23a956] pb-4' : ''}
            >
              {tab}
            </span>
          </div>
        );
      })}
    </div>
  );
}
