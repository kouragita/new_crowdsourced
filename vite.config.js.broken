import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'safari-pinned-tab.svg',
        'screenshot-*.png',
        'js/*.js'
      ],
      manifest: {
        name: 'CrowdSourced Learning Platform',
        short_name: 'CrowdSourced',
        description: 'Empower yourself with our easy-to-use learning platform designed for students, teachers, and institutions worldwide.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        id: 'crowdsourced-learning-platform',
        categories: ['education', 'productivity', 'learning'],
        lang: 'en',
        dir: 'ltr',
        
        // Updated icons configuration
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        
        // ✨ UPDATED SCREENSHOTS IN PROPER ORDER ✨
        screenshots: [
          // Narrow (Mobile) Screenshots
          {
            src: 'screenshot-narrow-home.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home - Welcome to CrowdSourced Learning Platform'
          },
          {
            src: 'screenshot-narrow-dashboard.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Dashboard - Your Learning Progress Overview'
          },
          {
            src: 'screenshot-narrow-courses-intro.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Courses - Course Introduction and Overview'
          },
          {
            src: 'screenshot-narrow-courses-outline.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Courses - Detailed Course Outline and Curriculum'
          },
          {
            src: 'screenshot-narrow-leaderboard.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Leaderboard - Compete and Track Rankings'
          },
          {
            src: 'screenshot-narrow-testmonies.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Testimonials - Success Stories from Our Learners'
          },
          
          // Wide (Desktop) Screenshots  
          {
            src: 'screenshot-wide-home.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Home - Welcome to CrowdSourced Learning Platform'
          },
          {
            src: 'screenshot-wide-dashboard.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Dashboard - Comprehensive Learning Analytics'
          },
          {
            src: 'screenshot-wide-courses-intro.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Courses - Explore Our Course Catalog'
          },
          {
            src: 'screenshot-wide-courses-outline.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Courses - Detailed Learning Path and Structure'
          },
          {
            src: 'screenshot-wide-leaderboard.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Leaderboard - Global Learning Competition'
          },
          {
            src: 'screenshot-wide-testmonies.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Testimonials - Learner Success Stories and Reviews'
          }
        ],
        
        // App shortcuts for quick access
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Go to your learning dashboard',
            url: '/dashboard',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              }
            ]
          },
          {
            name: 'Courses',
            short_name: 'Courses',
            description: 'Browse available courses',
            url: '/dashboard/courses',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              }
            ]
          },
          {
            name: 'Leaderboard',
            short_name: 'Leaderboard',
            description: 'View the learning leaderboard',
            url: '/dashboard/leaderboard',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              }
            ]
          },
          {
            name: 'Calendar',
            short_name: 'Calendar',
            description: 'Open your learning calendar',
            url: '/dashboard/calendar',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              }
            ]
          }
        ],
        
        // Enhanced PWA features
        share_target: {
          action: '/share',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url'
          }
        },
        
        protocol_handlers: [
          {
            protocol: 'web+crowdsourced',
            url: '/handle?protocol=%s'
          }
        ],
        
        prefer_related_applications: false,
        edge_side_panel: {
          preferred_width: 400
        },
        handle_links: 'preferred',
        launch_handler: {
          client_mode: 'navigate-existing'
        }
      },
      
      // Enhanced Workbox configuration
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}',
          'js/*.js'
        ],
        
        // Add screenshot files to precache
        additionalManifestEntries: [
          { url: 'screenshot-narrow-home.png', revision: null },
          { url: 'screenshot-narrow-dashboard.png', revision: null },
          { url: 'screenshot-narrow-courses-intro.png', revision: null },
          { url: 'screenshot-narrow-courses-outline.png', revision: null },
          { url: 'screenshot-narrow-leaderboard.png', revision: null },
          { url: 'screenshot-narrow-testmonies.png', revision: null },
          { url: 'screenshot-wide-home.png', revision: null },
          { url: 'screenshot-wide-dashboard.png', revision: null },
          { url: 'screenshot-wide-courses-intro.png', revision: null },
          { url: 'screenshot-wide-courses-outline.png', revision: null },
          { url: 'screenshot-wide-leaderboard.png', revision: null },
          { url: 'screenshot-wide-testmonies.png', revision: null },
          { url: 'js/app-loader.js', revision: null },
          { url: 'js/pwa-handler.js', revision: null }
        ],
        
        runtimeCaching: [
          // API caching strategy
          {
            urlPattern: /^https:\/\/e-learn-ncux\.onrender\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 5,
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?timestamp=${Date.now()}`
              }
            }
          },
          
          // Images caching strategy
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          
          // Fonts caching strategy
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          
          // Google Fonts caching
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ],
        
        // Skip waiting for new service worker
        skipWaiting: true,
        clientsClaim: true,
        
        // Cleanup outdated caches
        cleanupOutdatedCaches: true
      },
      
      // Development options
      devOptions: {
        enabled: process.env.NODE_ENV === 'development',
        type: 'module'
      }
    })
  ],
  
  // Server configuration
  server: {
    host: true,
    port: 3000,
    cors: true,
    headers: {
      // Enhanced security headers
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'esnext',
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          motion: ['framer-motion'],
          utils: ['axios', 'react-hot-toast', 'jwt-decode'],
          calendar: ['react-calendar'],
          ui: ['react-intersection-observer', 'react-loading-skeleton']
        }
      }
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'axios',
        'react-hot-toast'
      ]
    }
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    cors: true
  }
})