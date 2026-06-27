import ManageInventoryRow from './ManageInventoryRow';

const COLUMNS = [
  { label: 'Inventory name', width: '18%' },
  { label: 'Editors', width: '17%' },
  { label: 'Viewers', width: '17%' },
  { label: 'Status', width: '17%' },
  { label: '', width: '5%' },
];

export default function InventoriesTable({ inventories = [] }) {
  return (
    <div className='bg-white'>
      <div className='border-t border-[#e6e6ed] bg-white w-full'>
        <table
          className='text-[13px] border-collapse'
          style={{ width: '95%', margin: 'auto', tableLayout: 'fixed' }}
        >
          <thead className=' border-b border-[#e6e6ed]'>
            <tr style={{ height: 48 }}>
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  className='text-left font-semibold text-[12px] tracking-[1px] text-[#737373] uppercase align-middle bg-[#f8f9fa] border-none'
                  style={{
                    width: col.width,
                    padding: '0.75rem',
                    paddingLeft: i === 0 ? 0 : '0.75rem',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventories.map((inv) => (
              <ManageInventoryRow key={inv.id} inventory={inv} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
