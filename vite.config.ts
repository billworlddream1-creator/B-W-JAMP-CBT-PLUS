import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Vite options tailored for Tauri development and preventing early exit
      clearScreen: false,
      server: {
        port: 3000,
        strictPort: true,
        host: process.env.TAURI_DEV_HOST || '0.0.0.0',
        watch: {
          ignored: ["**/src-tauri/**"],
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
