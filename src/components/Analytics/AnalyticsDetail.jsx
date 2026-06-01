const TABS = [
  'Inventory Stats',
  'Food Usage',
  'Food Waste',
  'Purchases',
  'Delivery Stats',
  'Transfers',
];

export default function AnalyticsDetail({
  activeTab,
  onTabChange,
  inventoryName,
}) {
  return (
    <div className='w-full bg-white shrink-0'>
      {/* Inventory Name */}
      <div className='flex items-end' style={{ height: 75, padding: '0 35px' }}>
        <h1
          className='font-semibold'
          style={{
            fontSize: 22,
            lineHeight: '32px',
            letterSpacing: '-0.01em',
            color: '#19191c',
            marginBottom: 10,
          }}
        >
          {inventoryName}
        </h1>
      </div>

      {/* Tabs */}
      <div
        className='flex items-center'
        style={{
          padding: '0 35px',
          borderBottom: '1px solid #e6e6ed',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <div
              key={tab}
              onClick={() => onTabChange(tab)}
              style={{
                fontWeight: 800,
                fontSize: 13,
                lineHeight: '24px',
                color: '#19191c',
                paddingTop: 17,
                paddingBottom: 16,
                paddingLeft: 3, // ✅ small equal padding on both sides
                paddingRight: 4,
                marginRight: 20, // ✅ gap between tabs via margin not padding
                cursor: 'pointer',
                borderBottom: isActive
                  ? '2px solid #23a956'
                  : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {tab}
            </div>
          );
        })}
      </div>
    </div>
  );
}
