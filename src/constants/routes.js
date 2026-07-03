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

  EXTERNAL_ORDER_SEGMENT: 'external-order',
  INTERNAL_ORDER_SEGMENT: 'internal-order',
  ANALYTICS_SEGMENT: 'analytics',
  ANALYTICS_BY: '/analytics/by',
  ANALYTICS_BY_STOCK: '/analytics/bystock',
  ANALYTICS_BY_CATEGORY: '/analytics/bycategory',
  ANALYTICS_BY_CHECKIN: '/analytics/bycheckin',
  ANALYTICS_BY_CHECKOUT: '/analytics/bycheckout',
  ANALYTICS_BIGGEST_ORDERS: '/analytics/biggestorders',
  ANALYTICS_BIGGEST_SUPPLIERS: '/analytics/biggestsuppliers',
  ANALYTICS_PRICE_VARIATION: '/analytics/pricevariation',
};

export const EXTERNAL_ORDER_DETAIL_REGEX = /\/external-order\/.+\/.+/;
export const INTERNAL_ORDER_DETAIL_REGEX = /\/internal-order\/.+\/.+/;

export function inventoryProductLink(inventoryId, productName) {
  return `${ROUTES.INVENTORY}?id=${inventoryId}&productName=${encodeURIComponent(productName)}`;
}
