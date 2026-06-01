// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');

//   return {
//     plugins: [react()],
//     assetsInclude: ['**/*.xlsx'],
//     server: {
//       port: 3000,
//       historyApiFallback: true,
//       proxy: {
//         '/inventory': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/inventory-management': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/suppliers': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/master-data': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/internal-transfer': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/orders/store-orders/delivered-details': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/orders/store-orders': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/orders': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/internal-order': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//           bypass(req) {
//             if (
//               req.url === '/internal-orders' ||
//               req.url.startsWith('/internal-orders?')
//             ) {
//               return '/index.html';
//             }
//           },
//         },
//         '/analytics': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//         },
//         '/analytics-overview': {
//           target: env.VITE_API_BASE_URL,
//           changeOrigin: true,
//           secure: false,
//           bypass(req) {
//             return '/index.html';
//           },
//         },
//       },
//     },
//   };
// })

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
        '/inventory': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
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
              req.url === '/internal-orders' ||
              req.url.startsWith('/internal-orders?')
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
            if (req.url === '/analytics' || req.url.startsWith('/analytics?')) {
              return '/index.html';
            }
          },
        },
      },
    },
  };
});
