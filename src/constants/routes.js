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
};
