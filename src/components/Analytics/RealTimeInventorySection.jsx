// RealTimeInventorySection.jsx
import SectionHeader from '../Analytics/common/SectionHeader';
import InventoryCard from '../Analytics/common/InventoryCard';

const DUMMY_REALTIME = [
  {
    name: 'Main Inventory',
    value: '711 524,48 kr',
    description: '25.65 % of total inventories value',
    progress: 25.65,
  },
  {
    name: 'RFID Demo Inventory',
    value: '69 533,08 kr',
    description: '2.51 % of total inventories value',
    progress: 2.51,
  },
  {
    name: 'Empty Inventory',
    value: '134 543,49 kr',
    description: '4.85 % of total inventories value',
    progress: 4.85,
  },
  {
    name: 'Test inv',
    value: '20 027,66 kr',
    description: '0.72 % of total inventories value',
    progress: 0.72,
  },
  {
    name: 'Tanvi Inventory',
    value: '303 891,98 kr',
    description: '10.96 % of total inventories value',
    progress: 10.96,
  },
  {
    name: 'RFID-Demo',
    value: '657 987,25 kr',
    description: '23.72 % of total inventories value',
    progress: 23.72,
  },
  {
    name: 'Pinkesh Inventory',
    value: '70 177,87 kr',
    description: '2.53 % of total inventories value',
    progress: 2.53,
  },
  {
    name: 'Tsssst invvvv1',
    value: '85 119,74 kr',
    description: '3.07 % of total inventories value',
    progress: 3.07,
  },
  {
    name: 'Temp Empty Inventory',
    value: '0,00 kr',
    description: '0 % of total inventories value',
    progress: 0,
  },
  {
    name: 'Demo inv',
    value: '0,00 kr',
    description: '0 % of total inventories value',
    progress: 0,
  },
];

export default function RealTimeInventorySection() {
  return (
    <div>
      <SectionHeader
        title='Real time inventory value'
        lastUpdated='Last updated on Yesterday at 13:54'
      />
      <div
        className='flex flex-wrap w-full overflow-hidden rounded-lg'
        style={{
          border: '1px solid #e7e7ec',
          boxShadow:
            '0 2px 4px rgba(51,51,82,.08), 0 2px 6px rgba(51,51,82,.08)',
        }}
      >
        {DUMMY_REALTIME.map((item, i) => (
          <InventoryCard key={i} variant='realtime' item={item} />
        ))}
      </div>
    </div>
  );
}
