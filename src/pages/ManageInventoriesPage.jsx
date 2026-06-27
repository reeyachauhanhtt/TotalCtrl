import { useState } from 'react';

import ManageInventoriesHeader from '../components/Settings/ManageInventories/ManageInventoriesHeader';
import ManageInventoryTable from '../components/Settings/ManageInventories/ManageInventoryTable';
import AddNewInventory from '../components/Settings/ManageInventories/AddNewInventory';

const DUMMY_INVENTORIES = [
  {
    id: '1',
    name: 'Partner Integration Demo',
    status: 'Active',
    editors: [],
    viewers: [
      {
        id: 'u1',
        firstName: 'Gardians',
        lastName: 'of goods',
        avatarColor: '#1A713D',
        jobTitle: 'Developer',
      },
      {
        id: 'u2',
        firstName: 'Patel',
        lastName: 'Sweety',
        avatarColor: '#E7C40C',
        jobTitle: 'CEO',
      },
      {
        id: 'u3',
        firstName: 'Manish',
        lastName: 'Totalctrl',
        avatarColor: '#C6BBFD',
        jobTitle: 'Developer',
      },
      {
        id: 'u4',
        firstName: 'sagar',
        lastName: 'totalctrl',
        avatarColor: '#43BE71',
        jobTitle: 'manager',
      },
    ],
  },
  {
    id: '2',
    name: 'Walk-in fridge I RFID',
    status: 'Active',
    editors: [
      {
        id: 'u5',
        firstName: 'Totalctrl',
        lastName: 'Developer',
        avatarColor: '#B59F2B',
        jobTitle: 'Developer',
      },
    ],
    viewers: [],
  },
  {
    id: '3',
    name: 'Dry Storage I RFID',
    status: 'Active',
    editors: [
      {
        id: 'u6',
        firstName: 'Totalctrl',
        lastName: 'Developer',
        avatarColor: '#B59F2B',
        jobTitle: 'Developer',
      },
    ],
    viewers: [],
  },
  {
    id: '4',
    name: 'Test invv',
    status: 'Active',
    editors: [
      {
        id: 'u7',
        firstName: 'Gardians',
        lastName: 'of goods',
        avatarColor: '#1A713D',
        jobTitle: 'Developer',
      },
      {
        id: 'u8',
        firstName: 'Vikas',
        lastName: 'Patel',
        avatarColor: '#1F8E4E',
        jobTitle: 'Dev',
      },
    ],
    viewers: [
      {
        id: 'u9',
        firstName: 'Totalctrl',
        lastName: 'Developer',
        avatarColor: '#B59F2B',
        jobTitle: 'Developer',
      },
    ],
  },
  {
    id: '5',
    name: 'Empty Inv 21',
    status: 'Deactived',
    editors: [],
    viewers: [
      {
        id: 'u10',
        firstName: 'Manish',
        lastName: 'Totalctrl',
        avatarColor: '#C6BBFD',
        jobTitle: 'Developer',
      },
    ],
  },
];

export default function ManageInventoriesPage() {
  const [showAddInventory, setShowAddInventory] = useState(false);

  return (
    <div className='flex flex-col flex-1 overflow-hidden'>
      <ManageInventoriesHeader onAddClick={() => setShowAddInventory(true)} />
      <ManageInventoryTable inventories={DUMMY_INVENTORIES} />
      <AddNewInventory
        open={showAddInventory}
        onClose={() => setShowAddInventory(false)}
      />
    </div>
  );
}
