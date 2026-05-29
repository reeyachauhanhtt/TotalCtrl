// PurchasesSection.jsx
import SectionHeader from '../Analytics/common/SectionHeader';
import InventoryCard from '../Analytics/common/InventoryCard';

const DUMMY_PURCHASES = [
  {
    name: 'RFID Demo Inventory',
    value: '46 996,84 kr',
    description: '63.83 % of total inventories value',
    progress: 63.83,
  },
  {
    name: 'Empty inventory',
    value: '1 183,82 kr',
    description: '1.61 % of total inventories value',
    progress: 1.61,
  },
  {
    name: 'Sweety Inventory',
    value: '76,00 kr',
    description: '0.1 % of total inventories value',
    progress: 0.1,
  },
  {
    name: 'Empty Inv 21',
    value: '25 370,60 kr',
    description: '34.46 % of total inventories value',
    progress: 34.46,
  },
  {
    name: 'Temp Empty Inventory',
    value: '0,00 kr',
    description: '0 % of total inventories value',
    progress: 0,
  },
  {
    name: 'Main Inventory',
    value: '0,00 kr',
    description: '0 % of total inventories value',
    progress: 0,
  },
  {
    name: 'Test inv',
    value: '0,00 kr',
    description: '0 % of total inventories value',
    progress: 0,
  },
  {
    name: 'Tanvi Inventory',
    value: '0,00 kr',
    description: '0 % of total inventories value',
    progress: 0,
  },
];

export default function PurchasesSection() {
  return (
    <div>
      <SectionHeader title='Purchases' showMonthPicker />
      <div
        className='flex flex-wrap w-full overflow-hidden rounded-lg'
        style={{
          border: '1px solid #e7e7ec',
          boxShadow:
            '0 2px 4px rgba(51,51,82,.08), 0 2px 6px rgba(51,51,82,.08)',
        }}
      >
        {DUMMY_PURCHASES.map((item, i) => (
          <InventoryCard key={i} variant='purchases' item={item} />
        ))}
      </div>
    </div>
  );
}
