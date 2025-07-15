const fs = require('fs');
const path = require('path');

console.log('🔧 Complete Build Fix - Starting...');

const fixedViteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'CrowdSourced Learning Platform',
        short_name: 'CrowdSourced',
        description: 'Empower yourself with our easy-to-use learning platform designed for students, teachers, and institutions.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'android/android-launchericon-48-48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'android/android-launchericon-96-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'android/android-launchericon-144-144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'android/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\\/\\/e-learn-ncux\\.onrender\\.com\\/api\\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              networkTimeoutSeconds: 3
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  server: {
    host: true,
    port: 3000,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          motion: ['framer-motion'],
          utils: ['axios', 'react-hot-toast']
        }
      }
    }
  }
})`;

try {
  const viteConfigPath = path.join(process.cwd(), 'vite.config.js');
  if (fs.existsSync(viteConfigPath)) {
    fs.writeFileSync(viteConfigPath + '.backup', fs.readFileSync(viteConfigPath, 'utf8'));
  }
  
  fs.writeFileSync(viteConfigPath, fixedViteConfig);
  console.log('✅ Fixed vite.config.js');
  
  const dirsToClean = ['dist', 'node_modules/.vite', '.vite'];
  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  
  console.log('✅ Build fix complete!');
  console.log('🚀 Now run: npm run build');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
