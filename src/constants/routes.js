export const ROUTES = {
  INVENTORY: '/inventory',

  EXTERNAL_ORDERS: '/external-orders',
  EXTERNAL_ORDER_SCHEDULED: '/external-orders/scheduled-order/:orderId',
  EXTERNAL_ORDER_PARTIAL: '/external-orders/partially-delivered/:orderId',
  EXTERNAL_ORDER_DELIVERED: '/external-orders/delivered-order/:orderId',

  INTERNAL_ORDERS: '/internal-orders',
  INTERNAL_ORDER_SCHEDULED:
    '/internal-orders/internal-scheduled-order/:orderId',
  INTERNAL_ORDER_PARTIAL: '/internal-orders/internal-partially-order/:orderId',
  INTERNAL_ORDER_DELIVERED:
    '/internal-orders/internal-delivered-order/:orderId',

  ANALYTICS_OVERVIEW: '/analytics-overview',
  ANALYTICS: '/analytics',
  ANALYTICS_DETAILPAGE: '/analytics/*',

  PRODUCT_DATABASE: '/product-database',
  MANAGE_STORAGE: '/manage-storage',

  ROOT: '/',

  // Path segments used for substring/header-switching checks (App.jsx)
  EXTERNAL_ORDER_SEGMENT: 'external-order',
  INTERNAL_ORDER_SEGMENT: 'internal-order',
  ANALYTICS_SEGMENT: 'analytics',
  ANALYTICS_BY: '/analytics/by',
  ANALYTICS_BIGGEST_ORDERS: '/analytics/biggestorders',
  ANALYTICS_BIGGEST_SUPPLIERS: '/analytics/biggestsuppliers',
  ANALYTICS_PRICE_VARIATION: '/analytics/pricevariation',
};

// Regexes used to detect "inside a detail view" for the header switcher
export const EXTERNAL_ORDER_DETAIL_REGEX = /\/external-order\/.+\/.+/;
export const INTERNAL_ORDER_DETAIL_REGEX = /\/internal-order\/.+\/.+/;

//manage item template, inventory page navigation route
export function inventoryProductLink(inventoryId, productName) {
  return `${ROUTES.INVENTORY}?id=${inventoryId}&productName=${encodeURIComponent(productName)}`;
}
