import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: true,
    // Mock environment variables
    env: {
      VITE_GEOCODING_API_KEY: 'test-key'
    }
  }
});