import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const devIgnoredPaths = [
  '**/.checkpoints/**',
  '**/.cursor-checkpoints/**',
  '**/cursorfs-clone/**',
  '**/*backup*/**',
  '**/*.backup',
  '**/*.bak',
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: devIgnoredPaths,
    },
    fs: {
      deny: ['.checkpoints', '.cursor-checkpoints'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'three-viewer';
          }
        },
      },
    },
  },
});
