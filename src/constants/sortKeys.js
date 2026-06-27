export const INVENTORY_SORT_KEYS = {
  NAME: 'name',
  ARRIVAL_INFO: 'arrivalInfo',
  EXPIRATION_INFO: 'expirationInfo',
  QUANTITY: 'quantity',
  UNIT_PRICE: 'unitPrice',
  TOTAL: 'total',
};

export const ITEM_TEMPLATE_SORT_KEYS = {
  NAME: 'name',
  PURCHASE_UNIT: 'purchaseUnit',
  STOCK_TAKING_UNIT: 'stockTakingUnit',
  BASIC_MEAS_UNIT: 'basicMeasUnit',
  IN_STOCK: 'inStock',
  DURABILITY_DAYS: 'durabilityDays',
  SKU: 'sku',
};

export const ITEM_TEMPLATE_UNIT_SORT_KEYS = [
  ITEM_TEMPLATE_SORT_KEYS.PURCHASE_UNIT,
  ITEM_TEMPLATE_SORT_KEYS.STOCK_TAKING_UNIT,
  ITEM_TEMPLATE_SORT_KEYS.BASIC_MEAS_UNIT,
];
