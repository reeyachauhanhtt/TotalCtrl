// FoodUsageSection.jsx
import SectionHeader from '../Analytics/common/SectionHeader';
import InventoryCard from '../Analytics/common/InventoryCard';

const DUMMY_FOODUSAGE = [
  {
    name: 'Testt 22',
    value: '222 905,00 kr',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (0.36 %)',
    usedFoodValue: '805,00 kr',
    usedFoodProgress: 0.36,
    foodWasteLabel: 'Food waste (99.64 %)',
    foodWasteValue: '222 100,00 kr',
    foodWasteProgress: 99.64,
  },
  {
    name: 'Pinkesh Inventory',
    value: '160 678,60 kr',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (98.67 %)',
    usedFoodValue: '158 535,70 kr',
    usedFoodProgress: 98.67,
    foodWasteLabel: 'Food waste (1.33 %)',
    foodWasteValue: '2 142,90 kr',
    foodWasteProgress: 1.33,
  },
  {
    name: 'Empty Inv 21',
    value: '97 291,63 kr',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (73.82 %)',
    usedFoodValue: '71 817,99 kr',
    usedFoodProgress: 73.82,
    foodWasteLabel: 'Food waste (26.18 %)',
    foodWasteValue: '25 473,64 kr',
    foodWasteProgress: 26.18,
  },
  {
    name: 'Main Inventory',
    value: '68 908,40 kr',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (99.03 %)',
    usedFoodValue: '68 241,90 kr',
    usedFoodProgress: 99.03,
    foodWasteLabel: 'Food waste (0.97 %)',
    foodWasteValue: '666,50 kr',
    foodWasteProgress: 0.97,
  },
  {
    name: 'RFID-Demo',
    value: '61 551,04 kr',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (56.25 %)',
    usedFoodValue: '34 619,68 kr',
    usedFoodProgress: 56.25,
    foodWasteLabel: 'Food waste (43.75 %)',
    foodWasteValue: '26 931,36 kr',
    foodWasteProgress: 43.75,
  },
  {
    name: 'Tsssst invvvv1',
    value: '28 708,70 kr',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (99.65 %)',
    usedFoodValue: '28 608,70 kr',
    usedFoodProgress: 99.65,
    foodWasteLabel: 'Food waste (0.35 %)',
    foodWasteValue: '100,00 kr',
    foodWasteProgress: 0.35,
  },
  {
    name: 'Temp Empty Inventory',
    value: '0,00',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (0 %)',
    usedFoodValue: '0,00',
    usedFoodProgress: 0,
    foodWasteLabel: 'Food waste (0 %)',
    foodWasteValue: '0,00',
    foodWasteProgress: 0,
  },
  {
    name: 'Demo inv',
    value: '0,00',
    description: 'Total value of checked out food',
    usedFoodLabel: 'Used food (0 %)',
    usedFoodValue: '0,00',
    usedFoodProgress: 0,
    foodWasteLabel: 'Food waste (0 %)',
    foodWasteValue: '0,00',
    foodWasteProgress: 0,
  },
];

export default function FoodUsageSection() {
  return (
    <div>
      <SectionHeader title='Food usage' showMonthPicker />
      <div
        className='flex flex-wrap w-full overflow-hidden rounded-lg'
        style={{
          border: '1px solid #e7e7ec',
          boxShadow:
            '0 2px 4px rgba(51,51,82,.08), 0 2px 6px rgba(51,51,82,.08)',
        }}
      >
        {DUMMY_FOODUSAGE.map((item, i) => (
          <InventoryCard key={i} variant='foodusage' item={item} />
        ))}
      </div>
    </div>
  );
}
