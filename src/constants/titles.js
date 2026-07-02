//  Inventory + shared across Internal Order
export const SECTION_TITLES = {
  SELECT_LOCATION: 'Select location',
  PICK_ITEMS_TO_TRANSFER: 'Pick items to transfer',
  SELECTED_ITEMS: 'Selected items',
  SPECIFY_QUANTITIES: 'Specify quantities',
  IMPORT_ITEMS_TEMPLATE: 'Import items using a spreadsheet template',
};

export const INVENTORY_MODAL_TITLES = {
  addItemsTo: (inventoryName) => `Add items to ${inventoryName}`,
  cancelAddingItemsTo: (inventoryName) =>
    `Cancel adding items to ${inventoryName}?`,
  deleteItemFromInventory: (itemName) =>
    `Do you want to delete ${itemName}, from the Inventory`,
};
