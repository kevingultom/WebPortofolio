import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Group vendor code by library so unrelated app changes don't bust
        // the cache for large, rarely-changing dependencies like MUI.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-motion': ['framer-motion'],
          'vendor-misc': ['aos', 'sweetalert2', 'react-swipeable-views', 'axios', '@supabase/supabase-js'],
        },
      },
    },
  },
})
