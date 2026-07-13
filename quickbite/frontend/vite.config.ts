import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api/restaurants': {
        target: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/orders': {
        target: process.env.ORDER_SERVICE_URL || 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/notifications': {
        target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8083',
        changeOrigin: true,
      },
    }
  }
});
