//  Inventory page + shared across Internal Order
export const SECTION_TITLES = {
  SELECT_LOCATION: 'Select location',
  PICK_ITEMS_TO_TRANSFER: 'Pick items to transfer',
  SELECTED_ITEMS: 'Selected items',
  SPECIFY_QUANTITIES: 'Specify quantities',
  IMPORT_ITEMS_TEMPLATE: 'Import items using a spreadsheet template',
  SELECT_INVENTORY: 'Select Inventory',
  ORDER_DETAILS: 'Order details',
  ORDERED_ITEMS: 'Ordered items',
  ORDER_SUMMARY: 'Order summary',
  INVENTORY: 'Inventory',
  PICK_ITEMS_TO_ORDER: 'Pick items to order',
};

export const INVENTORY_MODAL_TITLES = {
  addItemsTo: (inventoryName) => `Add items to ${inventoryName}`,
  cancelAddingItemsTo: (inventoryName) =>
    `Cancel adding items to ${inventoryName}?`,
  deleteItemFromInventory: (itemName) =>
    `Do you want to delete ${itemName}, from the Inventory`,
};

// external order page
export const MODAL_TITLES = {
  ADD_ORDER_MANUALLY: 'Add order manually',
  EDIT_SCHEDULED_ORDER: 'Edit scheduled order',
  DISCARD_CHANGES: 'Discard changes?',
};

export const EXTERNAL_ORDER_MODAL_TITLES = {
  deleteOrderFromSupplier: (orderNumber, supplierName) =>
    `Delete order #${orderNumber} from ${supplierName}?`,
};

// internal order
export const INTERNAL_ORDER_MODAL_TITLES = {
  deleteOrderFromInventory: (orderNumber, fromInventoryName) =>
    `Delete order # ${orderNumber} from ${fromInventoryName} ?`,
};

// analytics page
export const ANALYTICS_SECTION_TITLES = {
  DELIVERY_STATS: 'Delivery Stats',
  FOOD_WASTE: 'Food Waste',
  TRANSFERS: 'Transfers',
  PURCHASES: 'Purchases',
  PRICE_VARIATIONS: 'Price Variations',
  REAL_TIME_INVENTORY_VALUE: 'Real time inventory value',
  FOOD_USAGE: 'Food usage',
};

// Analytics tab navigation labels
export const ANALYTICS_TABS = [
  'Inventory Stats',
  'Food Usage',
  'Food Waste',
  'Purchases',
  'Delivery Stats',
  'Transfers',
];

// manage item templates
export const ITEM_TEMPLATE_MODAL_TITLES = {
  ADD_ITEM_TEMPLATE: 'Add item template',
  EDIT_ITEM_TEMPLATE: 'Edit item template',
  DISCARD_UNSAVED_CHANGES: 'Discard unsaved changes?',
  DELETE_THE_TEMPLATE: 'Delete the template?',
  ADD_NEW_PRODUCT_TO_INVENTORY: 'Add new product to inventory',
  SELECTED_ITEMS_ASSIGN_SUPPLIER:
    'Selected items will be assigned to the chosen supplier',
};

export const ITEM_TEMPLATE_SECTION_TITLES = {
  BASIC_ITEM_INFO: 'Basic item info',
  UNITS: 'Units',
  CONVERSIONS: 'Conversions',
  SUBPAR_LEVEL: 'Subpar level',
  COST: 'Cost',
  COST_PER_UNIT_OVERVIEW: 'Cost per unit overview',
  AFFECTED_ITEMS: 'Affected items',
  ENTER_PRODUCT_NAME: 'Enter product name',
  SETUP_UNITS_AND_CONVERSIONS: 'Setup units and conversions',
  SPECIFY_QUANTITY_AND_SHELF_LIFE: 'Specify quantity and shelf life',
  TOTAL_PRODUCT_COST: 'Total product cost',
  PURCHASE_TO_STOCKTAKING_UNIT: 'Purchase unit to stocktaking unit',
  STOCKTAKING_TO_BASIC_UNIT: 'Stocktaking unit to basic measurement unit',
};

export const ITEM_TEMPLATE_DYNAMIC_TITLES = {
  deleteSelectedItems: (count) =>
    `Are you sure you want to delete ${count} selected item${count > 1 ? 's' : ''}?`,
};

export const UPLOAD_EXCEL_TITLES = {
  UPLOAD_ORDER_TO_EXTRACT_PRODUCTS: 'Upload an order to extract products',
  SUCCESS: 'Success',
  FILE_UPLOADED_SUCCESS: 'Your file has been succesfully uploaded',
  ISSUES_FOUND: 'Issues found',
  CONGRATULATIONS: 'Congratulations!',
  SETUP_UNIT_CONVERSIONS: 'Setup unit conversions',
};

export const BUTTON_LABELS = {
  CLEAR_THE_FILTER: 'Clear the filter',
  UPLOAD_ORDER_TO_EXTRACT_PRODUCTS: 'Upload an order to extract products',
};

// manage inventories
export const MANAGE_INVENTORIES_MODAL_TITLES = {
  ADD_NEW_INVENTORY: 'Add new inventory',
  EDIT_INVENTORY_INFO: 'Edit inventory info',
};

export const INVENTORY_ACTION_LABELS = {
  EDIT_INVENTORY_INFO: 'Edit inventory info',
  MANAGE_ACCESS: 'Manage access',
  ACTIVATE_INVENTORY: 'Activate Inventory',
  DEACTIVATE_INVENTORY: 'Deactivate Inventory',
  DELETE_INVENTORY: 'Delete Inventory',
};

export const INVENTORY_CONFIRM_MODAL = {
  title: (action, name) =>
    action === 'delete'
      ? `Are you sure you want to delete ${name}?`
      : `Are you sure you want to ${action} ${name}?`,
  description: {
    activate:
      'If you activate this inventory, it will be visible to the users which can see and edit it in the web administration and the mobile app.',
    deactivate:
      'If you deactivate this inventory, it wont be visible to the users anymore.',
    delete: 'This action is irreversible',
  },
};

// manage users
export const MANAGE_USER_MODAL_TITLES = {
  ADD_NEW_USER: 'Add new user',
  EDIT_USER_INFO: 'Edit user info',
  MANAGE_STORAGE_ACCESS: 'Manage storage access',
};

export const USER_ACTION_LABELS = {
  EDIT_USER_INFO: 'Edit user info',
  MANAGE_PERMISSION: 'Manage permission',
  ACTIVATE_USER: 'Activate user',
  DEACTIVATE_USER: 'Deactivate user',
  DELETE_USER: 'Delete user',
};

export const USER_CONFIRM_MODAL = {
  title: (action, fullName) =>
    action === 'delete'
      ? `Are you sure you want to delete ${fullName}?`
      : `Are you sure you want to ${action} ${fullName}?`,
  description: {
    activate:
      'If you activate this user, they will be able to sign in to the mobile app and web administration.',
    deactivate:
      'If you deactivate this user, they won’t be able to sign in to the mobile app and web administration.',
    delete: 'This action is irreversible',
  },
};

// manage roles
export const MANAGE_ROLES_MODAL_TITLES = {
  ADD_NEW_ROLE: 'Add New Role',
  EDIT_ROLE: 'Edit Role',
};

export const ROLE_ACTION_LABELS = {
  EDIT_ROLE: 'Edit Role',
  DELETE_ROLE: 'Delete Role',
};

export const ROLE_CONFIRM_MODAL = {
  title: (action, roleName) =>
    action === 'delete'
      ? `Confirm Delete Role ${roleName}?`
      : `Are you sure you want to ${action} ${roleName}?`,
  description: {
    delete:
      'Deleting this role will remove all associated permissions and cannot be undone. Are you sure you want to proceed?',
  },
};

// empty state labels
export const EMPTY_STATE_LABELS = {
  noOrdersForTab: (tab) => `No ${tab.toLowerCase()} orders`,
  NO_ITEMS_TRANSFERRED: 'No items transferred',
  NO_ITEMS_TRANSFERRED_DESC:
    "There aren't any items transferred into or from this inventory yet.",
  NO_DUPLICATE_ITEM_TEMPLATES: 'No duplicate item templates',
  NO_PRODUCTS: 'You have no products',
  NO_PRODUCTS_DESC:
    "To import products in bulk, upload your past orders in pdf, jpg or png format and we'll extract all the products for you.",
  NO_RESULT_FOUND: 'No result found',
  NO_DATA_FOUND: 'No data found',
  NO_PRODUCT_FOUND: 'Sorry no product found',
};

export const VALIDATION_LABELS = {
  FIELD_REQUIRED: 'This field is required',
  SELECT_FROM_TO_LOCATION: "Please select 'From' and 'To' location.",
};

// sidebar links
export const SIDEBAR_LINKS = {
  APP_STORE: 'https://apps.apple.com/us/app/totalctrl-restaurant/id1484776237',
  GOOGLE_PLAYSTORE:
    'https://play.google.com/store/apps/details?id=totalctrl.restaurant.manager',
  VIDEO_LIBRARY: 'https://www.youtube.com/watch?v=dHJzsYbJbrE',
  REFER_A_FRIEND:
    'https://totalctrl.getrewardful.com/signup?campaign=refer-a-friend-earn-rewards',
};
