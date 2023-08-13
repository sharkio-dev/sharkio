import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
        '/sharkio': 'http://localhost:5012',
      },
    },
  });
};
