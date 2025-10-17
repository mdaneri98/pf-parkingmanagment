import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 8082,
      open: false
    },
    preview: {
      port: 5173
    },
  resolve: {
    alias: {
      '@slices': path.resolve(__dirname, './src/slices'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@parking': path.resolve(__dirname, './src/features/parking'),
      '@reservations': path.resolve(__dirname, './src/features/reservations'),
      '@prices': path.resolve(__dirname, './src/features/prices'),
      '@users': path.resolve(__dirname, './src/features/users'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@walkinstays': path.resolve(__dirname, './src/features/walkinstays'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '0.1.0')
    }
  };
});


