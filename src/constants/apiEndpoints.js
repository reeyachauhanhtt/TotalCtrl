export const API_ENDPOINTS = {
  // ── MASTER_DATA ──
  MASTER_DATA_MEASUREMENT_UNITS: '/master-data/measurement-units',
  MASTER_DATA_QUALITY_ISSUES: '/master-data/quality-issues',

  // ── TRANSFERS ──
  INTERNAL_TRANSFER: '/internal-transfer',
  INTERNAL_TRANSFER_UNDO: (transferId) =>
    `/internal-transfer/${transferId}/undo`,

  // ── SUPPLIERS ──
  SUPPLIERS: '/suppliers',

  // ── INVENTORY ──
  INVENTORY: '/inventory',
  INVENTORY_ME_ACCESS: '/inventory/me/access',
  INVENTORY_STORE_USERS_ACCESS: '/inventory/store-users/access',
  INVENTORY_DETAIL: (id) => `/inventory/${id}`,
  INVENTORY_ACCESS: (id) => `/inventory/${id}/access`,
  INVENTORY_STOCK_VALUE: '/inventory-management/store-products/stock-value',
  INVENTORY_DOWNLOAD_CSV: '/inventory-management/store-products/download-csv',
  STORE_USERS_PERMISSIONS: '/store-users/permissions',

  // ── PRODUCTS ──
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  PRODUCT_GROUPS: '/product-groups',
  PRODUCTS_PARSE_EXCEL: '/products/parse-excel',
  PRODUCTS_ADD_INITIAL: '/products/add-initial',
  STORE_PRODUCTS: '/inventory-management/store-products',
  STORE_PRODUCTS_SEARCH: '/inventory-management/store-products/search',
  STORE_PRODUCT_DETAIL: (rawId) =>
    `/inventory-management/store-products/${rawId}`,
  GENERATE_PRODUCTS_PDF: '/inventory-management/generate-products-pdf',
  SUPPLIER_PRODUCTS: (supplierId) => `/suppliers/${supplierId}/products`,

  // ── EXTERNAL ORDERS ──
  ORDERS: '/orders',
  ORDER_DETAIL: (orderId) => `/orders/store-orders/${orderId}`,
  ORDER_DELIVERED_DETAILS: '/orders/store-orders/delivered-details',
  STORE_ORDERS: '/orders/store-orders',

  // ── INTERNAL_ORDERS ──
  INTERNAL_ORDER: '/internal-order',
  INTERNAL_ORDER_DETAIL: (orderId) => `/internal-order/${orderId}`,

  // ── ANALYTICS ──

  // general
  ANALYTICS_INVENTORY_TOTAL: '/analytics/inventory/total',
  ANALYTICS_FOOD_USAGE_TOTAL: '/analytics/food-usage/total',
  ANALYTICS_PURCHASE_TOTAL: '/analytics/purchase/total',
  ANALYTICS_TOTAL_FOOD_COST: '/analytics/food-cost/total-food-cost',
  ANALYTICS_FOOD_COST_PERCENTAGE_TIME:
    '/analytics/food-cost/food-cost-percentage-time',
  ANALYTICS_MONTHLY_COGS_MONTH_LIST: '/analytics/monthly-cogs/month-list',

  // inventory stats
  ANALYTICS_INVENTORY_VALUE_BY_STOCK: '/analytics/inventory/value-by-stock',
  ANALYTICS_INVENTORY_VALUE_BY_CATEGORY:
    '/analytics/inventory/value-by-category',
  ANALYTICS_INVENTORY_CHECK_IN_VALUE:
    '/analytics/inventory/check-in-value-by-category',
  ANALYTICS_INVENTORY_CHECK_OUT_VALUE:
    '/analytics/inventory/check-out-value-by-category',
  ANALYTICS_INVENTORY_EXPORT: '/analytics/inventory/export',

  // purchases
  ANALYTICS_PURCHASE_BIGGEST_ORDERS: '/analytics/purchase/biggest-orders',
  ANALYTICS_PURCHASE_BIGGEST_SUPPLIERS: '/analytics/purchase/biggest-suppliers',
  ANALYTICS_PURCHASE_PRICE_VARIATIONS: '/analytics/purchase/price-variations',

  // food waste
  ANALYTICS_FOOD_WASTE_TOTAL: '/analytics/food-waste/total-foodwaste',
  ANALYTICS_FOOD_WASTE_BY_CAUSE: '/analytics/food-waste/foodwaste-by-cause',
  ANALYTICS_FOOD_WASTE_BY_CATEGORY:
    '/analytics/food-waste/foodwaste-by-category',
  ANALYTICS_FOOD_WASTE_MOST_WASTED_ITEMS:
    '/analytics/food-waste/most-wasted-items',
  ANALYTICS_FOOD_WASTE_OVERVIEW: '/analytics/food-waste/foodwaste-overview',
  ANALYTICS_FOOD_WASTE_OTHER_REASON_LINE_ITEMS:
    '/analytics/food-waste/other-reason-line-items',

  // food usage
  ANALYTICS_FOOD_USAGE_PRODUCT: '/analytics/food-usage/product',

  // delivery stats
  ANALYTICS_DELIVERY_TOTAL_RETURNED_GOODS:
    '/analytics/delivery-stats/total-returned-goods',
  ANALYTICS_DELIVERY_SUPPLIER_RANKING:
    '/analytics/delivery-stats/supplier-ranking',

  // transfers (analytics tab)
  ANALYTICS_TRANSFER_IN: '/analytics/transfer/in',
  ANALYTICS_TRANSFER_OUT: '/analytics/transfer/out',
  ANALYTICS_TRANSFER_ITEMS: '/analytics/transfer/items',
  ANALYTICS_TRANSFER_ITEM_INVENTORIES: '/analytics/transfer/item-inventories',

  // ── MANAGE USERS ──
  MANAGE_USERS: {
    LIST: '/store-users',
    ROLES: '/store-users/roles',
    ADMINS: '/store-users/admins',
  },

  GET_USER_INVENTORY_PERMISSIONS: (userId) =>
    `/store-users/${userId}/inventory-permission`,
  SAVE_USER_INVENTORY_PERMISSIONS: (userId) =>
    `/store-users/${userId}/inventory-permissions/bulk`,
};
