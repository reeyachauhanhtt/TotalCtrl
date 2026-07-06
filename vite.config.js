import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    assetsInclude: ['**/*.xlsx'],
    server: {
      port: 3000,
      proxy: {
        '/store-users': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        // '/store-users/permissions': {
        //   target: env.VITE_API_BASE_URL,
        //   changeOrigin: true,
        //   secure: false,
        // },
        '/inventory': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          bypass(req) {
            if (
              req.method === 'GET' &&
              (req.url === '/inventory' || req.url.startsWith('/inventory?'))
            ) {
              return '/index.html';
            }
          },
        },
        '/inventory-management': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/suppliers': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/master-data': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/internal-transfer': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/orders/store-orders/delivered-details': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/orders/store-orders': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/orders': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/internal-order': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          bypass(req) {
            if (
              req.method === 'GET' &&
              (req.url === '/internal-orders' ||
                req.url.startsWith('/internal-orders?'))
            ) {
              return '/index.html';
            }
          },
        },
        '/analytics': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          bypass(req) {
            if (
              req.method === 'GET' &&
              (req.url === '/analytics' ||
                req.url.startsWith('/analytics?') ||
                req.url.startsWith('/analytics/by') ||
                req.url === '/analytics-overview' ||
                req.url.startsWith('/analytics-overview?'))
            ) {
              return '/index.html';
            }
          },
        },
        '/products': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/product-groups': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
