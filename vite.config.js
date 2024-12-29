import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Set the root to the current directory
  build: {
    outDir: 'dist', // Specify the output directory
    rollupOptions: {
      input: './test.html', // Use test.html as the entry point
    },
  },
});
